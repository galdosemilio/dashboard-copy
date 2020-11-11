// tslint:disable:forin
import { writeFileSync } from 'fs';
import { isEqual } from 'lodash';
import { ApiProvider, RenderProvider, RenderRoute, RequestsMap, ResponsesMap } from '../parser/api';
import { genBarrels } from './barrel';
import { Imports } from './imports';
import { genInterfaces, tplType } from './interface';
import {
  exists,
  genApiUrl,
  genDescriptionArray,
  isPartial,
  normalizeName,
  runPrettier,
  sortFunction
} from './utils';

/**
 * Provider Generator
 */
export async function genProvider(modFolder: string, providerName: string, provider: ApiProvider) {
  const requests: RequestsMap = {};
  const responses: ResponsesMap = {};
  const imports = new Imports();

  // build the provider file content
  let content = '';

  for (const [name, method] of Object.entries<RenderRoute>(provider as RenderProvider)) {
    const methodName = normalizeName(name);
    const methodPrefix = normalizeName(name, true) + normalizeName(providerName, true);

    // process request
    method.req = {
      type: ''
    };

    if (method.apiParam) {
      method.req = exists(method.apiParam, imports.shared);
      method.req.isOptional = isPartial(method.apiParam);
      if (!method.req.type) {
        method.req.type = `${methodPrefix}Request`;
        requests[method.req.type] = {
          api: {
            ...method.api,
            version: method.version
          },
          fields: method.apiParam
        };
      }
    }

    // process response
    if (method.apiSuccess) {
      if (!method.apiSuccess.success) {
        method.res = exists(method.apiSuccess, imports.shared, true);
        if (!method.res.type) {
          // index the name
          method.res.type =
            name === 'GetSingle'
              ? `${normalizeName(providerName, true)}Single`
              : `${methodPrefix}Response`;
          // index the definiion
          responses[method.res.type] = {
            api: {
              ...method.api,
              version: method.version
            },
            fields: method.apiSuccess
          };
        }
      } else {
        // support premade responses of any success-type
        method.res = {
          type: tplType(null, method.apiSuccess.success, imports),
          desc: method.apiSuccess.success.description
        };
      }
    } else {
      if (method.hasResponse) {
        console.log(`RESPONSE: not defined for ${providerName}.${methodName}`);
      }
      method.res = {
        type: 'void'
      };
    }

    // axios parameters
    method.parameters = hasParameters(method)
      ? `,
        data: request`
      : '';

    // doc block
    method.description = genDescriptionArray(method.description).join(' * ') + ' *';

    if (method.permissions) {
      method.description += ` Permissions: ${method.permissions.join(', ')}
        *`;
    }

    if (method.req.type) {
      method.description += `
        * @param ${method.req.isOptional ? '[request]' : 'request'} must implement ${
        method.req.type
      }`;
    }

    method.description += `
    * @return Promise<${method.res.type}> ${method.res.desc || ''}`;

    // build the method
    content += tplEndpoint(methodName, method);
  }

  let renderer;
  switch (providerName) {
    case 'Session':
      renderer = tplSession;
      break;
    default:
      renderer = tplProvider;
  }

  writeFileSync(
    `${modFolder}/${normalizeName(providerName)}.provider.ts`,
    await renderer(providerName, imports, Object.keys(requests), Object.keys(responses), content),
    'utf-8'
  );

  // process the barrels setting up the folders
  await genBarrels(modFolder, providerName, Object.keys(requests), Object.keys(responses));

  // process the responses and requests
  if (Object.keys(requests).length) {
    await genInterfaces(modFolder, 'requests', requests);
  }
  if (Object.keys(responses).length) {
    await genInterfaces(modFolder, 'responses', responses, true);
  }
}

/**
 * Provider Template
 */
export async function tplProvider(
  providerName: string,
  imports: Imports,
  requests: string[],
  responses: string[],
  content: string
) {
  let code = `
    import { Injectable } from '@angular/core';
    import { ApiService } from '../../api.service';
  `;

  code += imports.forProvider();

  if (requests.length) {
    code += `
    import {
    ${requests
      .sort(sortFunction)
      .map(reqType => `${reqType},\n`)
      .join('')}
    } from './requests'`;
  }
  if (responses.length) {
    code += `
    import {
    ${responses
      .sort(sortFunction)
      .map(resType => `${resType},\n`)
      .join('')}
    } from './responses'`;
  }

  code += `

    @Injectable({
      providedIn: 'root'
    })
    export class ${normalizeName(providerName, true)} {
      public constructor(private readonly apiService: ApiService) {}${content}
    }
  `;

  return runPrettier(code);
}

/**
 * Custom Session Template
 */
export async function tplSession(
  providerName: string,
  imports: Imports,
  requests: string[],
  responses: string[],
  content: string
) {
  let code = `
    import { Injectable } from '@angular/core';
    import { SessionActions, SessionState } from '@coachcare/backend/store/session';
    import { Store } from '@ngrx/store';
    import { ApiService } from '../../api.service';
    import { Account } from '../account';
  `;

  code += imports.forProvider();

  if (requests.length) {
    code += `
    import {
    ${requests
      .sort(sortFunction)
      .map(reqType => `${reqType},\n`)
      .join('')}
    } from './requests'`;
  }
  if (responses.length) {
    code += `
    import {
    ${responses
      .sort(sortFunction)
      .map(resType => `${resType},\n`)
      .join('')}
    } from './responses'`;
  }

  code += `

    @Injectable({
      providedIn: 'root'
    })
    export class ${normalizeName(providerName, true)} {
      public constructor(
        private readonly store: Store<SessionState.State>,
        private readonly apiService: ApiService,
        private readonly account: Account
      ) {}${content}
    }
  `;

  return runPrettier(code);
}

/**
 * Endpoint Template
 */
export function tplEndpoint(methodName: string, method: RenderRoute) {
  switch (methodName) {
    case 'login': {
      return tplEndpointLogin(methodName, method);
    }
    default:
      return `

    /**
     * ${method.description}
     */
    public ${methodName}(${
        method.req.type ? `request${method.req.isOptional ? '?' : ''}: ${method.req.type}` : ''
      }): Promise<${method.res.type}> {
      return this.apiService.request({
        endpoint: \`${genApiUrl('request', method)}\`,
        method: '${method.api.method}',
        version: '${method.version}'${method.parameters}
      })${method.res.fieldId ? `.then(res => ({ id: res.${method.res.fieldId}.toString() }))` : ''};
    }`;
  }
}

/**
 * Custom Login Template
 */
export function tplEndpointLogin(methodName: string, method: RenderRoute) {
  return `

  /**
   * ${method.description}
   */
  public ${methodName}(${
    method.req.type ? `request${method.req.isOptional ? '?' : ''}: ${method.req.type}` : ''
  }): Promise<${method.res.type}> {
    let response: ${method.res.type};

    return this.apiService.request({
      endpoint: \`${genApiUrl('request', method)}\`,
      method: '${method.api.method}',
      version: '${method.version}'${method.parameters}
    })
    .then(res => {
      response = res;
      return this.apiService.doLogin(res).then(() => this.check());
    })
    .then(res => {
      return this.account.getSingle(res);
    })
    .then(user => {
      this.store.dispatch(new SessionActions.Login(user));
      return response;
    });
  }`;
}

/**
 * Parameters Inclusion Checker
 */
export function hasParameters(method: RenderRoute) {
  if (
    !method.apiParam ||
    (['HEAD', 'DELETE'].includes(method.api.method) && method.version !== '1.0')
  ) {
    return false;
  }
  // check if all the parameters are in the URL
  let matches = method.api.url.match(/:[a-zA-Z0-9]+/g);
  if (matches) {
    matches = matches.map(match => match.slice(1));
    const params = Object.keys(method.apiParam);
    if (isEqual(params.sort(), matches.sort())) {
      return false;
    }
  }
  return true;
}
