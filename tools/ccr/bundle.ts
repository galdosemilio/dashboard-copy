import { copy } from 'cpx';
import { existsSync, lstatSync, readdirSync, readFileSync, writeFileSync } from 'fs';
import { ngPackagr } from 'ng-packagr';
import { join, resolve } from 'path';
import { bundleScss } from './scss';
import { FILES, libRoot, libSrc } from './utils';

export function bundleOptions(yargs) {
  return yargs
    .positional('lib', {
      type: 'string',
      describe: 'Library name`'
    })
    .positional('version', {
      type: 'string',
      describe: 'Version`'
    });
}

export function bundle(parsedArgs: any, args: string[]) {
  packagr(args[0])
    .then(() => postBundle(args[0], args[1]))
    .then(() => bundleScss(args[0]));
  // npm publish --access=public dist/libs/$lib
}

function packagr(libName: string): Promise<any> {
  return ngPackagr()
    .forProject(join(libSrc(libName), 'package.json'))
    .withTsConfig(resolve(join(libRoot(libName), 'tsconfig.lib.json')))
    .build()
    .catch(error => {
      console.error(error);
      process.exit(1);
    });
}

function postBundle(libName: string, version: string): Promise<void> {
  // main package.json
  let path = join(libSrc(libName), 'package.json');
  let packageJson = JSON.parse(readFileSync(path, { encoding: 'utf8' }));
  packageJson['version'] = version;
  writeFileSync(path, JSON.stringify(packageJson, undefined, 2));

  // dist package.json
  path = join('./dist/libs', libName, 'package.json');
  packageJson = JSON.parse(readFileSync(path, { encoding: 'utf8' }));
  packageJson['version'] = version;

  delete packageJson['$schema'];
  // delete packageJson['sideEffects'];
  if (packageJson.license === 'MIT') {
    delete packageJson['private'];
  }
  writeFileSync(path, JSON.stringify(packageJson, undefined, 2));

  // copy the library files
  FILES.forEach(file => {
    const origin = join('./libs', libName, file);
    if (existsSync(origin) && lstatSync(origin).isFile()) {
      copy(origin, join('./dist/libs', libName));
    }
  });

  return Promise.resolve();
}
