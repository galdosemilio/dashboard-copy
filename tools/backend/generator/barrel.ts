import { existsSync, readFileSync, writeFileSync } from 'fs';
import { mkdirpSync } from 'fs-extra';
import { outputFolder } from '../config';
import { normalizeFileName, normalizeName, runPrettier, sortFunction } from './utils';

/**
 * Barrels Generator
 */
export async function genBarrels(
  modFolder: string,
  providerName: string,
  requests: string[],
  responses: string[]
) {
  let fileName = `${modFolder}/index.ts`;
  writeFileSync(
    fileName,
    await tplProviderBarrel(fileName, providerName, requests, responses),
    'utf-8'
  );

  if (requests.length) {
    mkdirpSync(`${modFolder}/requests`);

    fileName = `${modFolder}/requests/index.ts`;
    writeFileSync(fileName, await tplInterfacesBarrel(fileName, requests), 'utf-8');
  }

  if (responses.length) {
    mkdirpSync(`${modFolder}/responses`);

    fileName = `${modFolder}/responses/index.ts`;
    writeFileSync(fileName, await tplInterfacesBarrel(fileName, responses), 'utf-8');

    fileName = `${modFolder}/responses/index.test.ts`;
    writeFileSync(fileName, await tplInterfacesBarrel(fileName, responses, true), 'utf-8');

    fileName = `${modFolder}/index.test.ts`;
    writeFileSync(fileName, await runPrettier(`export * from './responses/index.test';`), 'utf-8');
  }
}

/**
 * Provider Barrel Template
 */
export async function tplProviderBarrel(
  fileName: string,
  providerName: string,
  requests: string[],
  responses: string[]
) {
  let code = '';

  if (!existsSync(fileName)) {
    // build the initial code
    if (requests.length) {
      code += `
        export * from './requests';`;
    }
    if (responses.length) {
      code += `
        export * from './responses';`;
    }
    code += `

      export * from './${normalizeName(providerName)}.provider';
    `;
  } else {
    // fetch the existing code
    code = readFileSync(fileName, 'utf-8');
    if (requests.length && !code.includes(`export * from './requests';`)) {
      code = `
        export * from './requests';${code}`;
    }
    if (responses.length && !code.includes(`export * from './responses';`)) {
      code = `
        export * from './responses';${code}`;
    }
    code += `export * from './${normalizeName(providerName)}.provider';
    `;
  }

  return runPrettier(code);
}

/**
 * Interface Barrel Template
 */
export async function tplInterfacesBarrel(
  fileName: string,
  interfaces: string[],
  withTest = false
) {
  let code = '';

  if (existsSync(fileName)) {
    code = readFileSync(fileName, 'utf-8');
  }

  interfaces.sort(sortFunction).map(interfaceName => {
    const normalizedName = normalizeFileName(interfaceName);

    code += `
      export * from './${normalizedName}';`;

    if (withTest) {
      code += `
        export * from './${normalizedName}.test';`;
    }
  });

  return runPrettier(code);
}

/**
 * Entities Barrel Template
 */
export async function tplEntitiesBarrel(fileName: string, interfaces: string[], withTests = false) {
  let code = '';

  if (existsSync(fileName)) {
    code = readFileSync(fileName, 'utf-8');
  }

  interfaces.sort(sortFunction).map(interfaceName => {
    const normalizedName = normalizeFileName(interfaceName);

    code += `
      export * from './${normalizedName}';`;

    if (withTests) {
      code += `
        export * from './${normalizedName}.test';`;
    }
  });

  return runPrettier(code);
}

/**
 * Providers Barrel Generator
 */
export async function genProvidersBarrel(modules: string[], providers: string[]) {
  let code = '';
  let test = '';
  let fileName: string;

  // providers/index
  modules.sort(sortFunction).map(modName => {
    const folder = normalizeName(modName);

    code += `
      export * from './${folder}';`;

    fileName = `${outputFolder}/providers/${folder}/index.test.ts`;
    if (existsSync(fileName)) {
      test += `
        export * from './${folder}/index.test';`;
    }
  });

  fileName = `${outputFolder}/providers/index.ts`;
  writeFileSync(fileName, await runPrettier(code), 'utf-8');

  if (test) {
    fileName = `${outputFolder}/providers/index.test.ts`;
    writeFileSync(fileName, await runPrettier(test), 'utf-8');
  }

  // module.providers
  const classes = providers
    .map(name => normalizeName(name, true))
    .sort(sortFunction)
    .join(', ');

  code = `import {
    ${classes}
  } from './index';

  export const GatewayProviders = [
    ${classes}
  ];`;

  fileName = `${outputFolder}/providers/providers.index.ts`;
  writeFileSync(fileName, await runPrettier(code), 'utf-8');
}
