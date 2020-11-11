import { camelCase, upperCase } from 'lodash';
import { reposDir } from '../config';
import { RawApiRoute } from './api';

export function routeParser(tags: any, srcFile: string): RawApiRoute {
  const route = {
    description: '',
    src: srcFile.replace(`./${reposDir}/`, '')
  } as RawApiRoute;

  for (const tag of tags) {
    switch (tag.tag) {
      case 'api':
        validateApiTag(tag);
        route.api = {
          method: upperCase(tag.type),
          url: tag.name.replace('/:versionNumber', '')
        };
        route.description = tag.description;
        break;

      case 'apiVersion':
        route.version = `${tag.name}.${tag.tags[0].name}`;
        break;

      case 'apiGroup':
        route.group = tag.name;
        break;

      case 'apiName':
        route.name = tag.name;
        break;

      case 'apiDescription':
        route.description = tag.source.slice(16);
        break;

      case 'apiPermission':
        if (!route.permissions) {
          route.permissions = [];
        }
        route.permissions.push(tag.name);
        break;

      case 'apiSuccessExample':
        route.hasResponse = true;
        break;

      case 'apiError':
      case 'apiErrorExample':
      case 'versionNumber':
        // ignore
        break;

      default:
        const field = tag.tag;

        if (!route[field]) {
          route[field] = {};
        }

        parseRecursive(tag);

        const name = tag.name;
        delete tag.name;

        route[field][name] = tag;
    }
  }

  return route;
}

function validateApiTag(tag) {
  const method = upperCase(tag.type);

  if (!['HEAD', 'GET', 'POST', 'PATCH', 'PUT', 'DELETE'].includes(method)) {
    console.log(`METHOD: ${tag.source}`);
  }
}

function parseRecursive(tag) {
  const isVar = ['apiParam', 'apiSuccess'].includes(tag.tag);

  if (isVar && tag.source) {
    // parse the grouped responses
    if (tag.name.startsWith('(')) {
      const matches = tag.source.match(/@apiSuccess \((.*?) (.*?)\) (.*)?/);
      if (matches) {
        const [, res, code, text] = matches;
        tag.name = 'success';
        tag.code = code;

        const data = text.match(/^{(.*?)} (.*?) (.*)/);
        if (data) {
          // explicit return type
          const [, type, name, desc] = data;
          if (name !== camelCase(name)) {
            tag.type = type;
            tag.description = `${name} ${desc}`;
          } else {
            tag.name = name;
            tag.type = type;
            tag.description = desc;
          }
        } else {
          // generic response
          const [, name, , desc] = text.match(/^([^\s]+)( (.*))?/);
          if (['empty', 'blank'].includes(name)) {
            tag.type = 'void';
            delete tag.description;
          } else {
            tag.description = desc;
          }
        }
      }
    }
    // log the faulty tags
    if (!tag.type) {
      console.log(`FAULTY: ${tag.source}`);
    }
    if (tag.source.includes('@@api')) {
      console.log(`Remove one @: ${tag.source}`);
    }
  }

  if (tag.tags) {
    tag.children = {};
    for (const child of tag.tags) {
      parseRecursive(child);
      const name = child.name;
      delete child.name;
      tag.children[name] = child;
    }
    delete tag.tags;
  }

  tag.type = tag.type.replace(/"/g, "'");

  if (tag.type.includes('=')) {
    const parts = tag.type.split('=', 2);
    tag.type = parts[0];
    tag.values = parts[1].replace(/\,/g, ' | ');
  }

  if (!tag.type) {
    tag.type = 'Object';
  }

  if (tag.name.includes('=')) {
    const parts: Array<string> = tag.name.split('=', 2);
    tag.name = parts[0];
    tag.default = parts[1].replace(/[\\'\\<\\>]/, '');
  }

  // check for possible faulty tag
  if (tag.name !== camelCase(tag.name)) {
    const data = tag.source.match(/{(.*?)} (.*?) (.*)/);
    if (data) {
      let name: string = data[2];
      // cleanup the extracted name
      if (name.match(/^\[(.*)\]$/)) {
        // process optional names
        name = name.slice(1, -1);
      }
      if (name.includes('.') || name.includes('_')) {
        // process the names with special chars
        name = name.split(/[\\.\\_]/)[0];
      }
      if (name.indexOf('[]') === name.length - 2) {
        // process arrays
        name = name.slice(0, -2);
      }
      if (name === upperCase(name)) {
        // exclude uppercased names
        name = camelCase(name);
      }
      // remove any numbers of the check
      name = name.replace(/[0-9]/g, '');

      if (name !== camelCase(name)) {
        console.log(`REVIEW: ${tag.source}`);
      }
    }
  }

  if (!tag.optional || !isVar) {
    delete tag.optional;
  }

  if (tag.default && tag.default.startsWith('{')) {
    delete tag.default;
  }

  delete tag.line;
  delete tag.source;
  delete tag.tag;
  delete tag.tags;
}
