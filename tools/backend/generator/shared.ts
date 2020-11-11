import { readFileSync } from 'fs';
import * as glob from 'glob';
import { setGenericTypes } from './entities';

/**
 * Available Generic Types Extractor
 */
export async function extractGenericTypes() {
  const genericTypes: Array<string> = [];

  const paths = [
    './libs/backend/src/lib/services/shared/generic/*.ts',
    './libs/backend/src/lib/services/shared/responses/*.ts'
  ];

  for (const path of paths) {
    const files = glob.sync(path);

    for (const file of files) {
      if (file.endsWith('.test.ts')) {
        continue;
      }

      const content = readFileSync(file, 'utf-8');
      const pattern = /export ([a-zA-z]*) ([a-zA-z0-9]*)/g;
      let result;
      while (1) {
        result = pattern.exec(content);
        if (!result) {
          break;
        }
        // second matching group is the name
        genericTypes.push(result[2]);
      }
    }

    setGenericTypes(genericTypes);
  }
}
