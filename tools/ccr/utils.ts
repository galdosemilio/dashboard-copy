import { lstatSync, readdirSync } from 'fs';
import { join } from 'path';

export function isLibrary(source) {
  return lstatSync(source).isDirectory() ? lstatSync(join(source, 'package.json')).isFile() : false;
}

export function getLibs(source) {
  return readdirSync(source).filter(name => isLibrary(join(source, name)));
}

export const FILES = ['LICENSE', 'README.md'];

export const libRoot = (libName: string) => `./libs/${libName}`;
export const libSrc = (libName: string) => `./libs/${libName}/src/lib`;
