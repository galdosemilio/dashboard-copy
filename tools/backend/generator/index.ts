// tslint:disable:forin
import { readFileSync, writeFileSync } from 'fs';
import { mkdirpSync, removeSync } from 'fs-extra';
import { outputFolder, reposDir } from '../config';
import { RoutesMap } from '../parser/api';
import { genProvidersBarrel } from './barrel';
import { extendsMap } from './entities';
import { genEntities } from './interface';
import { genProvider } from './provider';
import { extractGenericTypes } from './shared';
import { runLinter } from './utils';

/**
 * Generate API MicroProviders using the next structure:
 * - providers
 *   - modname
 *     - requests/
 *       - $requestName.request.ts
 *       - index.ts
 *     - responses/
 *       - $responseName.(response|item).ts
 *       - index.ts
 *     - $providerName.provider.ts
 *     - index.ts
 * - shared
 *     - entities/
 *       - $entityName.ts
 *       - index.ts
 *
 * TODO
 * - Implement response validator mode (test) using io-ts
 * - Backend tests: copy the tests at libs/api and port it to MicroProviders
 */
export async function generate() {
  const routes: RoutesMap = JSON.parse(readFileSync(`${reposDir}/routes.json`, 'utf-8'));

  const baseFolder = `${outputFolder}/providers`;
  removeSync(baseFolder);

  // collect shared type names and save them
  extractGenericTypes();

  const providers: Array<string> = [];
  for (const modName in routes) {
    for (const providerName in routes[modName]) {
      const provider = routes[modName][providerName];

      const modFolder = `${baseFolder}/${modName.toLowerCase()}`;
      mkdirpSync(modFolder);

      // generate each provider
      await genProvider(modFolder, providerName, provider);
      providers.push(providerName);
    }
  }

  // generate the providers barrel
  genProvidersBarrel(Object.keys(routes), providers);

  // write the entities
  genEntities();

  // debug: writes the resulting inheritance map
  writeFileSync(`${reposDir}/inheritance.json`, JSON.stringify(extendsMap, null, 2), 'utf-8');

  // ends running tslint
  runLinter();
}
