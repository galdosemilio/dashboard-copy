import { getModname, normalizeFileName, normalizeName, normalizeTest, sortFunction } from './utils';

/**
 * Imports Collector and Handler
 */
export class Imports {
  /**
   * Invoker flag
   */
  fromEntity = '';
  fromInterface = '';
  fromResponse = false;

  /**
   * shared/entities
   */
  entities: Array<string> = [];
  entitiesTests: Array<string> = [];

  /**
   * shared/generic
   */
  shared: Array<string> = [];
  sharedTests: Array<string> = [];

  /**
   * others
   */
  others: Array<string> = [];
  othersTests: Array<string> = [];

  /**
   * siblings
   */
  siblings: Array<string> = [];
  siblingsTests: Array<string> = [];

  /**
   * tests
   */
  iots = false;
  tests: Array<string> = [];

  /**
   * Import Addition
   */
  addIoTs() {
    this.iots = true;
  }

  hasSameModule(responseName, interfaceName) {
    return getModname(responseName) === getModname(interfaceName);
  }

  /**
   * Provider Imports
   */
  forProvider() {
    let code = '';

    if (this.shared.length || this.entities.length) {
      code += `
      import {
      ${this.shared
        .concat(this.entities)
        .sort(sortFunction)
        .map(entityName => `${entityName},\n`)
        .join('')}
      } from '../../shared'`;
    }

    return code;
  }

  /**
   * Entity Imports
   */
  forEntity(testMode = false) {
    let code = '';

    if (testMode) {
      if (this.tests.length) {
        code += `\nimport { ${this.tests
          .sort(sortFunction)
          .join(', ')} } from '@coachcare/backend/tests';`;
      }

      if (this.iots) {
        code += `\nimport * as t from 'io-ts';`;
      }
    }

    if (this.shared.length) {
      code += `
        import {
        ${this.shared
          .map(entityName => `${entityName},\n`)
          .sort(sortFunction)
          .join('')}
        } from '../generic';`;
    }

    if (testMode && this.sharedTests.length) {
      code += `
        import {
        ${this.sharedTests
          .map(entityName => `${entityName},\n`)
          .sort(sortFunction)
          .join('')}
        } from '../generic/index.test';`;
    }

    if (this.entities.length) {
      this.entities.sort(sortFunction).map(entityName => {
        code += `
          import { ${entityName} } from './${normalizeName(entityName)}';`;
      });
    }

    if (testMode && this.entitiesTests.length) {
      this.entitiesTests.sort(sortFunction).map(entityName => {
        code += `
          import { ${normalizeTest(entityName)} } from './${normalizeName(entityName)}.test';`;
      });
    }

    if (this.siblings.length) {
      code += this.siblings
        .sort(sortFunction)
        .map(v => `import { ${v} } from './${normalizeFileName(v, false)}';`)
        .join('');
    }

    if (testMode && this.siblingsTests.length) {
      code += this.siblingsTests
        .sort(sortFunction)
        .map(v => `import { ${v} } from './${normalizeFileName(v, true)}';`)
        .join('');
    }

    return code;
  }

  /**
   * Interface Imports
   */
  forInterface(testMode = false) {
    let code = '';

    if (testMode) {
      if (this.tests.length) {
        code += `
          import { ${this.tests.sort(sortFunction).join(', ')} } from '@coachcare/backend/tests';`;
      }

      if (this.iots) {
        code += `
          import * as t from 'io-ts';`;
      }
    }

    if (this.entities.length || this.shared.length) {
      code += `
        import {
        ${this.entities
          .concat(this.shared)
          .sort(sortFunction)
          .join(',\n')}
        } from '../../../shared';`;
    }

    if (this.entitiesTests.length || this.sharedTests.length) {
      code += `
        import {
        ${this.entitiesTests
          .concat(this.sharedTests)
          .sort(sortFunction)
          .join(',\n')}
        } from '../../../shared/index.test';`;
    }

    if (this.others.length) {
      code += this.others
        .map(
          v => `import { ${v} } from '../../${getModname(v)}/responses/${normalizeFileName(v)}';`
        )
        .join('');
    }

    if (this.othersTests.length) {
      code += this.othersTests
        .map(
          v =>
            `import { ${v} } from '../../${getModname(v)}/responses/${normalizeFileName(v, true)}';`
        )
        .join('');
    }

    if (this.siblings.length) {
      code += this.siblings
        .sort(sortFunction)
        .map(sibling => `import { ${sibling} } from './${normalizeFileName(sibling)}';`)
        .join('');
    }

    if (this.siblingsTests.length) {
      code += this.siblingsTests
        .sort(sortFunction)
        .map(sibling => `import { ${sibling} } from './${normalizeFileName(sibling, true)}';`)
        .join('');
    }

    return code;
  }
}
