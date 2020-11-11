import * as commentParser from 'comment-parser';
import { writeFileSync } from 'fs';
import * as glob from 'glob';
import { reposDir } from '../config';
import { RoutesMap } from './api';
import { docsParser } from './docs';
import { routeParser } from './route';

// control vars
const modNames: Array<string> = [];
const apiNames: Array<string> = [];

/**
 * Main Method
 */
export function parse() {
  const files = glob.sync(`./${reposDir}/**/*.ts`, { ignore: `./${reposDir}/**/*.d.ts` });

  // collect the routes
  const routes: RoutesMap = {};
  const debug = {};

  const { jsDefs, jsDocs } = docsParser(files);

  const defs = {};
  for (const jsDef of jsDefs) {
    const tags = commentParser(jsDef.doc, { dotted_names: true })[0].tags;
    const name = tags[0].name;
    defs[name] = jsDef.doc.replace(new RegExp(`@apiDefine ${name}`), '').slice(4, -4);
  }
  defs['VersionNumber'] = ''; // we handle the version with the ApiService

  for (const jsDoc of jsDocs) {
    // replace definitions
    if (jsDoc.doc.includes('@apiUse')) {
      const matches = jsDoc.doc
        .match(/@apiUse (.*)\s/g)
        .map(match => match.slice(8, -1))
        .filter((v, i, a) => a.indexOf(v) === i);

      for (const match of matches) {
        jsDoc.doc = jsDoc.doc.replace(new RegExp(`.+?@apiUse ${match}`, 'g'), defs[match]);
      }
    }
  }

  // parse JSDocs
  for (const jsDoc of jsDocs) {
    const route = routeParser(
      commentParser(jsDoc.doc, { dotted_names: true })[0].tags,
      jsDoc.srcFile
    );

    const modName = getModuleName(route.group);
    const group = route.group;
    const name = collectName(route.name);
    delete route.group;
    delete route.name;

    if (!routes[modName]) {
      routes[modName] = {};
      debug[modName] = {};
    }
    if (!routes[modName][group]) {
      routes[modName][group] = {};
      debug[modName][group] = {};
    }

    // if already exists, prefer the web-gateway route because it's the public one
    if (routes[modName][group][name]) {
      // TODO detect outdated stuff on web-gateway here
      if (!routes[modName][group][name].src.includes('web-gateway')) {
        routes[modName][group][name] = route;
        debug[modName][group][name] = `${route.api.method} ${route.version} ${route.api.url}`;
      }
    } else {
      routes[modName][group][name] = route;
      debug[modName][group][name] = `${route.api.method} ${route.version} ${route.api.url}`;
    }
  }

  // console.log('@apiNames used:');
  // apiNames.map(name => console.log(name));

  writeFileSync(`${reposDir}/routes.json`, JSON.stringify(routes, null, 2), 'utf-8');
  writeFileSync(`${reposDir}/debug.json`, JSON.stringify(debug, null, 2), 'utf-8');
}

/**
 * Module Name Generator
 */
function getModuleName(group: string) {
  let modName = group.split('-')[0];

  // loop the existing modules looking for partial match
  modNames.map(mod => {
    if (modName.indexOf(mod) === 0) {
      modName = mod;
    }
  });

  if (!modNames.includes(modName)) {
    modNames.push(modName);
  }

  return modName;
}

/**
 * ApiNames Collector
 */
function collectName(name: string) {
  if (!apiNames.includes(name)) {
    apiNames.push(name);
  }

  return name;
}
