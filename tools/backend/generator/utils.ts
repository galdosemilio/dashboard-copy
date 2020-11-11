import { readFileSync } from 'fs';
import * as glob from 'glob';
import { camelCase, lowerFirst } from 'lodash';
import * as prettier from 'prettier';
import { Configuration, Linter } from 'tslint';
import { outputFolder } from '../config';
import { ApiEndpoint, ApiField, ApiMap, ApiRoute, RenderResponse, RenderType } from '../parser/api';

export const sortFunction = (a, b) => a.localeCompare(b);

/**
 * Normalization Utils
 */
export function normalizeName(name: string, forClass = false) {
  name = name.replace(/-/g, '');

  return forClass ? name : camelCase(name);
}

export function normalizeTest(name: string) {
  return `${lowerFirst(name)}`; // TODO reconsider Test suffix
}

export function normalizeFileName(interfaceName: string, testMode = false): string {
  let fileName;
  if (interfaceName.endsWith('Request')) {
    fileName = normalizeName(interfaceName).slice(0, -7) + '.request';
  } else if (interfaceName.endsWith('Response')) {
    fileName = normalizeName(interfaceName).slice(0, -8) + '.response';
  } else if (interfaceName.endsWith('Single')) {
    fileName = normalizeName(interfaceName).slice(0, -6) + '.single';
  } else {
    fileName = normalizeName(interfaceName);
  }
  return `${fileName}${testMode ? '.test' : ''}`;
}

/**
 * Array Utils
 */
export function addImport(value: string, list: Array<string>) {
  if (!list.includes(value)) {
    list.push(value);
  }
}

/**
 * API Url Generator
 */
export function genApiUrl(variableName: string, route: ApiRoute) {
  let url = route.api.url;

  const matches = url.match(/:[a-zA-Z0-9]+/g);
  if (matches) {
    const matchesMapping = matches.map(match => [match, `\${${variableName}.${match.slice(1)}}`]);
    for (const mapping of matchesMapping) {
      url = url.replace(mapping[0], mapping[1]);
    }
  }

  if (route.apiParam && route.api.method === 'HEAD') {
    const params: Array<string> = [];
    for (const [name, param] of Object.entries<ApiField>(route.apiParam)) {
      params.push(`${name}=\${encodeURIComponent(${variableName}.${name})}`);
    }
    url += `?` + params.join('&');
  }

  return url;
}

/**
 * Prettier
 */
export async function runPrettier(code: string) {
  return prettier.resolveConfig('./prettierrc').then(options =>
    prettier.format(code, {
      ...options,
      parser: 'typescript'
    })
  );
}

/**
 * TSLint
 */
export function runLinter() {
  // lint the project checking types
  const options = {
    fix: true,
    formatter: 'json'
  };
  const program = Linter.createProgram('./tsconfig.json', './libs/backend/src/');

  const linter = new Linter(options, program);

  // lint each generated file
  const files = glob.sync(`${outputFolder}/../**/*.ts`);
  for (const fileName of files) {
    const fileContents = readFileSync(fileName, 'utf-8');
    const config = Configuration.findConfiguration('./tslint.json', fileName);
    linter.lint(fileName, fileContents, config.results);
  }
}

/**
 * Endpoint parent field getter
 */
export function getParentField(endpoint: ApiEndpoint<ApiField>): ApiField | null {
  const keys = Object.keys(endpoint.fields);

  if (keys.length !== 1) {
    console.error('ENDPOINT: Expected one parent field.', endpoint);
    return null;
  }
  return endpoint.fields[keys[0]];
}

export function getSharedInterface(endpoint: ApiEndpoint<ApiField>) {
  const keys = Object.keys(endpoint.fields);

  // PagedResponse
  if (keys.length === 2 && keys.includes('data') && keys.includes('pagination')) {
    return { type: 'PagedResponse', field: endpoint.fields.data };
  }
  // ListedResponse
  if (keys.length === 1 && keys.includes('data')) {
    return { type: 'ListResponse', field: endpoint.fields.data };
  }

  return null;
}

/**
 * Description generator
 */
export function genDescriptionArray(text: string) {
  const max = 140 /* lint */ - 1 /* point */ - 1 /* parenthesis */ - 5 /* indent */ - 10 /* deep */;

  return text
    .replace(/<(?:.|\n)*?>/gm, '')
    .replace(/\n/g, ' ')
    .split('.')
    .filter(String)
    .reduce((res: string[], curr) => {
      if (res.length === 0) {
        res.push(curr);
      } else if (res[res.length - 1].length + curr.length < max) {
        res[res.length - 1] += `.${curr}`;
        // } else if (!curr.startsWith(' ')) {
        //   res[res.length - 1] += `.${curr}`;
      } else {
        res.push(curr);
      }
      // verify it's longer than the allowed
      if (res[res.length - 1].length > max) {
        const item: string = res[res.length - 1];
        if (item.indexOf('.') > item.length - max) {
          // previously joined string
          const partials = item.split('.').filter(String);
          res[res.length - 1] = partials.splice(0, 1).join('');
          res.push(partials.join('.'));
        } else if (item.indexOf('(') > item.length - max) {
          // start parenthesis
          const partials = item.split('(').filter(String);
          res[res.length - 1] = partials.splice(0, 1).join('');
          res.push('(' + partials.join('.'));
        } else if (item.indexOf(')') > item.length - max) {
          // end parenthesis
          const partials = item.split(')').filter(String);
          res[res.length - 1] = partials.splice(0, 1).join('') + ')';
          res.push(partials.join('.'));
        } else if (item.indexOf('[') > item.length - max) {
          // example
          const partials = item.split('[').filter(String);
          res[res.length - 1] = partials.splice(0, 1).join('');
          res.push('[' + partials.join('.'));
        } else if (item.lastIndexOf(',') > item.length - max) {
          // comma punctuation
          const partials = item.split(',').filter(String);
          const segment = partials.splice(-1).join('');
          res[res.length - 1] = partials.join(',') + ',';
          res.push(segment);
        }
      }
      return res;
    }, [])
    .map(line => {
      line = line.trim();
      if (![')', ',', '.', ':'].includes(line.slice(-1))) {
        line += '.';
      }
      return `${line}\n`;
    });
}

/**
 * Interface Analyzers
 */
export function exists(
  definition: ApiMap<ApiField>,
  shared: Array<string>,
  isResponse = false
): RenderType | RenderResponse {
  const fields = Object.keys(definition);

  function yesItIs(entity: string, name?: string, field?: ApiField) {
    if (!shared.includes(entity)) {
      shared.push(entity);
    }
    return {
      type: entity,
      fieldId: name,
      desc: field && field.description
    };
  }

  // Entity response
  if (fields.length === 1 && fields.includes('id')) {
    return yesItIs('Entity');
  }

  if (isResponse && fields.length === 1 && fields[0].endsWith('Id')) {
    return yesItIs('Entity', fields[0], definition[fields[0]]);
  }

  return { type: '' };
}

export function isPartial(definition: ApiMap<ApiField>) {
  // all fields must be optional
  for (const [, field] of Object.entries<ApiField>(definition)) {
    if (!field.optional) {
      return false;
    }
  }
  return true;
}

export function getModname(interfaceName: string) {
  return interfaceName.split(/(?=[A-Z])/)[0].toLowerCase();
}
