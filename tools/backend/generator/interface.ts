import { writeFileSync } from 'fs';
import { mkdirpSync, removeSync } from 'fs-extra';
import {
  camelCase,
  isEqual,
  isEqualWith,
  isPlainObject,
  lowerFirst,
  merge,
  trim,
  upperFirst
} from 'lodash';
import { outputFolder } from '../config';
import { ApiEndpoint, ApiField, ApiMap, ApiRequest, RequestsMap } from '../parser/api';
import { tplEntitiesBarrel } from './barrel';
import {
  coreTypes,
  entitiesMap,
  extendsMap,
  overrideMap,
  processExtensibleType,
  sharedMap,
  typesMap
} from './entities';
import { Imports } from './imports';
import {
  addImport,
  genDescriptionArray,
  getParentField,
  getSharedInterface,
  isPartial,
  normalizeFileName,
  normalizeName,
  normalizeTest,
  runPrettier
} from './utils';

/**
 * Interfaces Generator
 */
export async function genInterfaces(
  modFolder: string,
  subPath: string,
  interfaces: RequestsMap,
  withTest = false
) {
  for (const [name, definition] of Object.entries<ApiRequest>(interfaces)) {
    const fileName = normalizeFileName(name);

    let filePath = `${modFolder}/${subPath}/${fileName}.ts`;
    writeFileSync(filePath, await tplInterface(name, definition), 'utf-8');

    if (withTest) {
      filePath = `${modFolder}/${subPath}/${fileName}.test.ts`;
      writeFileSync(filePath, await tplInterface(name, definition, true), 'utf-8');
    }
  }
}

/**
 * Entities Generator
 */
export async function genEntities() {
  const baseFolder = `${outputFolder}/shared/entities`;
  removeSync(baseFolder);
  mkdirpSync(baseFolder);

  const entities = Object.keys(entitiesMap);

  if (entities.length) {
    let fileName;
    for (const [name, entity] of Object.entries<ApiField>(entitiesMap)) {
      fileName = normalizeName(name);

      let filePath = `${baseFolder}/${fileName}.ts`;
      writeFileSync(filePath, await tplEntity(name, entity), 'utf-8');

      filePath = `${baseFolder}/${fileName}.test.ts`;
      writeFileSync(filePath, await tplEntity(name, entity, true), 'utf-8');
    }

    fileName = `${baseFolder}/index.ts`;
    writeFileSync(fileName, await tplEntitiesBarrel(fileName, entities), 'utf-8');

    fileName = `${baseFolder}/index.test.ts`;
    writeFileSync(fileName, await tplEntitiesBarrel(fileName, entities, true), 'utf-8');
  }
}

/**
 * Entity Template
 */
export async function tplEntity(name: string, field: ApiField, testMode = false) {
  const imports = new Imports();
  imports.fromEntity = name;

  let content = '{}';
  if (field.values) {
    content = tplValues(field.values, imports, testMode);
  } else if (field.children) {
    content = tplFields(name, field.children, imports, testMode);
  }

  if (extendsMap[name]) {
    if (testMode) {
      addImport(normalizeTest(extendsMap[name]), imports.entitiesTests);
    } else {
      addImport(extendsMap[name], imports.entities);
    }
  }

  let code = `/**
    * ${testMode ? normalizeTest(name) : name}
    */
   `;

  code += imports.forEntity(testMode);

  if (testMode) {
    code += `

      export const ${normalizeTest(name)} = ${content}
      `;
  } else if (field.values) {
    code += `

      export type ${name} = ${content}

      export const ${camelCase(name)}s: Array<${name}> = [
        ${field.values
          .split('|')
          .map(trim)
          .join(',')}
      ];
    `;
  } else if (field.children) {
    code += `

      export interface ${name}${extendsMap[name] ? ` extends ${extendsMap[name]}` : ''} ${content}
    `;
  }

  // return code;
  return runPrettier(code);
}

/**
 * Interface Template
 */
export async function tplInterface(
  name: string,
  endpoint: ApiEndpoint<ApiField>,
  testMode = false
) {
  const imports = new Imports();
  imports.fromInterface = name;
  imports.fromResponse = name.endsWith('Response');

  let type = 'interface';
  let content = '';

  // special cases overrides
  switch (name) {
    // direct Array return
    case 'GetAllMeasurementActivityResponse':
    case 'GetAllMobilePushClientResponse':
    case 'GetAllScheduleAvailableResponse':
    case 'GetDetailedMeasurementActivityResponse':
    case 'GetOpenTimeslotsQuickSchedulerResponse':
    case 'GetOpenTimeslotsSchedulerResponse':
    case 'GetAllKeyAccountResponse':
      type = 'type';
      const parent = getParentField(endpoint);
      content = parent ? ` = ${tplType(null, parent, imports, testMode)}` : ` = any`;
      break;
    default:
      const special = getSharedInterface(endpoint);
      if (special) {
        // special interface
        const normalType = tplType(null, special.field, imports, testMode);
        let dataType: any = normalType.match(/^Array<(.*)?(\>|\))$/);
        if (dataType) {
          // TODO check Segment suffix naming-convention of normalType
          dataType = dataType[1];
          if (testMode) {
            if (!dataType.startsWith('t.')) {
              const specialType = lowerFirst(special.type);
              const testType = normalizeTest(dataType);
              content = `createTest<${dataType}>(
                '${dataType}',
                ${specialType}(${testType})
              )`;
              addImport('createTest', imports.tests);
              addImport(dataType, imports.entities);
              addImport(specialType, imports.entitiesTests);
              addImport(testType, imports.entitiesTests);
            }
          } else {
            addImport(special.type, imports.entities);
            type = 'type';
            content = normalType.replace(/^Array/, `= ${special.type}`);
          }
          break;
        } else {
          console.error(`SPECIAL: ${special.type} needs a type on ${name}`);
        }
      }
      // normal interface
      content = tplFields(name, endpoint.fields, imports, testMode);
      if (testMode) {
        if (imports.fromResponse) {
          addImport('createTest', imports.tests);
          addImport(name, imports.siblings);
          content = `createTest<${name}>(
            '${name}',
            ${content.slice(16)}`;
        } else if (name.endsWith('Single')) {
          addImport('createTestFromValidator', imports.tests);
          addImport(name, imports.siblings);
          content += `

          export const ${normalizeTest(
            name.slice(0, -6)
          )}Response = createTestFromValidator<${name}>(
            '${name}',
            ${normalizeTest(name)}
          );`;
        }
      }
  }

  let code = `
    /**
     * ${endpoint.api.method} ${endpoint.api.url}
     */

    `;

  code += imports.forInterface(testMode);

  code += `

  export ${testMode ? 'const' : type} ${testMode ? lowerFirst(name) : name}${
    testMode && type === 'interface' ? '=' : ''
  } ${content}
  `;
  // return code;
  return runPrettier(code);
}

/**
 * Fields Template
 */
export function tplFields(
  parent: string,
  fields: ApiMap<ApiField>,
  imports: Imports,
  testMode = false
) {
  let code = '';

  try {
    for (let [propName, prop] of Object.entries<ApiField>(fields)) {
      propName = /^[0-9]/.test(propName) ? `'${propName}'` : propName;
      if (prop.description) {
        const arrayDescription = genDescriptionArray(prop.description);
        if (arrayDescription.length === 1) {
          code += '/** ' + arrayDescription[0].slice(0, arrayDescription[0].length - 1) + ' */\n';
        } else {
          code += '/** \n * ' + arrayDescription.join(' * ') + ' */\n';
        }
      }
      code += `${propName}${prop.optional ? (testMode ? ': optional(' : '?: ') : ': '}`;
      code += `${tplType(parent, prop, imports, testMode)}`;
      code += `${prop.optional && testMode ? ')' : ''}${testMode ? ',' : ';'}\n`;

      // add the test imports
      if (testMode) {
        if (!imports.fromResponse || parent) {
          addImport('createValidator', imports.tests);
        }
        if (prop.optional) {
          addImport('optional', imports.tests);
        }
      }
    }
  } catch (e) {
    console.log(e);
  }

  return testMode
    ? `createValidator({${
        extendsMap[parent] ? `...${normalizeTest(extendsMap[parent])}.type.props,\n` : ''
      }${code}
      })`
    : `{
        ${code}
      }`;
}

/**
 * Type Template
 */
export function tplType(parent: any, field: ApiField, imports: Imports, testMode = false) {
  let typeName = field.type;
  const values = field.values;
  field.partial = field.children ? isPartial(field.children) : false;

  if (overrideMap.hasOwnProperty(typeName)) {
    typeName = overrideMap[typeName];
  }

  // check inheritance of an existing type through partial name match
  if (!testMode && field.children) {
    processExtensibleType(typeName, field);
  }

  if (typeName.endsWith('Single') || typeName.endsWith('Response')) {
    // response
    testMode
      ? addImport(
          normalizeTest(typeName),
          imports.fromInterface
            ? imports.hasSameModule(imports.fromInterface, typeName)
              ? imports.siblingsTests
              : imports.othersTests
            : imports.entitiesTests
        )
      : addImport(
          typeName,
          imports.fromInterface
            ? imports.hasSameModule(imports.fromInterface, typeName)
              ? imports.siblings
              : imports.others
            : imports.entities
        );
    return tplPartial(typeName, field.partial, imports, testMode);
  } else if (typeName in typesMap || values) {
    // existing type or type definition
    return processType(field, imports, testMode);
  } else if (typeName.includes('/')) {
    // union of types
    if (testMode) {
      return `t.union([${typeName
        .split('/')
        .map(part => tplType(parent, { type: part }, imports, testMode))
        .join(', ')}])`;
    } else {
      return typeName
        .split('/')
        .map(part => tplType(parent, { type: part }, imports, testMode))
        .join(' | ');
    }
  } else if (typeName.endsWith('[]')) {
    // arrays
    const itemName = typeName.replace('[]', '');
    const internalType = tplType(
      itemName,
      {
        ...field,
        type: itemName
      },
      imports,
      testMode
    );
    if (testMode) {
      imports.addIoTs();
      return `t.array(${internalType})`;
    }
    return `Array<${internalType}>`;
  } else if (typeName === 'Array' && field.children) {
    // untyped array
    const internalType = tplFields(typeName, field.children, imports, testMode);
    if (testMode) {
      imports.addIoTs();
      return `t.array(${internalType})`;
    }
    return `Array<${internalType}>`;
  } else if (field.children) {
    // entity
    return processType(field, imports, testMode);
  } else if (typeName === 'Any') {
    // log wildcards
    console.log(`ANY: needs to specify typing for '${field.description}'`);
    if (testMode) {
      imports.addIoTs();
      return `t.any`;
    }
    return `any`;
  } else if (typeName === 'void') {
    // void response
    if (testMode) {
      addImport('voidTest', imports.tests);
      return 'voidTest';
    }
    return `void`;
  } else if (typeName === 'Object') {
    // object without children
    console.log(`OBJECT: no children to type`, field);
    if (testMode) {
      imports.addIoTs();
      return `t.any`;
    }
    return `any`;
  } else {
    console.log(`UNKNOWN TYPE: ${typeName}`);
    console.log(field);
  }
}

export function tplValues(values: string, imports: Imports, testMode = false) {
  const isArray = values.startsWith('[') && values.endsWith(']');
  if (isArray) {
    values = values.slice(1, -1);
  }
  if (testMode) {
    imports.addIoTs();
    return `${isArray ? 't.array(' : ''}t.union([${values
      .split('|')
      .map(value => `t.literal(${value.trim()})`)
      .join(', ')}])${isArray ? ')' : ''}`;
  } else {
    return `${isArray ? 'Array<' : ''}${values}${isArray ? '>' : ''}`;
  }
}

/**
 * Type Processor
 */
export function processType(field: ApiField, imports: Imports, testMode = false) {
  const typeName = upperFirst(field.type);
  const values = field.values;

  if (!typeName) {
    console.log('EMPTY TYPE: ', field);
    return testMode ? 't.any' : 'any';
  } else if (typeName === 'Any') {
    return testMode ? 't.any' : 'any';
  }

  if (values && !coreTypes.includes(typeName)) {
    // field has a definition
    if (typesMap.hasOwnProperty(typeName)) {
      /**
       * manual check of some special cases
       */
      if (entitiesMap[typeName] && entitiesMap[typeName].values !== values) {
        // verify it's the same
        console.log(`VERIFY TYPE: ${typeName} = ${entitiesMap[typeName].values} || ${values}`);
      }
    } else {
      typesMap[typeName] = typeName;
      entitiesMap[typeName] = field;
    }
  }

  if (typesMap.hasOwnProperty(typeName)) {
    if (entitiesMap.hasOwnProperty(typeName)) {
      // check if it's the same definition
      if (!isEqualWith(entitiesMap[typeName], field, equalCheck)) {
        console.log('DIFF ENTITIES!');
        console.log(entitiesMap[typeName]);
        console.log(field);
        entitiesMap[typeName] = merge(
          {},
          field,
          entitiesMap[typeName],
          field.partial ? entitiesMap[typeName] : field
        );
      }
      testMode
        ? addImport(normalizeTest(typeName), imports.entitiesTests)
        : addImport(typeName, imports.entities);
    }
    if (sharedMap.includes(typeName)) {
      testMode
        ? addImport(normalizeTest(typeName), imports.sharedTests)
        : addImport(typeName, imports.shared);
    }
    if (testMode) {
      if (
        sharedMap.includes(typeName) ||
        imports.entitiesTests.includes(normalizeTest(typesMap[typeName]))
      ) {
        return normalizeTest(typesMap[typeName]);
      } else {
        imports.addIoTs();
        return `t.${lowerFirst(typesMap[typeName])}`;
      }
    }
    return tplPartial(typesMap[typeName], field.partial || false, imports, testMode);
  }

  if (typeName !== 'Object' && field.children) {
    typesMap[typeName] = typeName;
    entitiesMap[typeName] = field;
    // add the imports
    testMode
      ? addImport(normalizeTest(typeName), imports.entitiesTests)
      : addImport(typeName, imports.entities);
    // process the type without generate code
    tplFields(typeName, field.children, new Imports(), testMode);
    return tplPartial(typeName, field.partial || false, imports, testMode);
  } else if (values) {
    return tplValues(values, imports, testMode);
  } else if (field.children) {
    return tplFields(typeName, field.children, imports, testMode);
  } else {
    console.error('UNPROCESSED TYPE: ', field);
  }
}

/**
 * Partial Template
 */
export function tplPartial(
  typeName: string,
  partial: boolean,
  imports: Imports,
  testMode: boolean
) {
  // exclude some partials
  if (typeName === 'Pagination' || typeName.endsWith('Sort')) {
    return testMode ? normalizeTest(typeName) : typeName;
  }

  if (testMode && partial) {
    imports.addIoTs();
  }

  let code;
  code = `${partial ? (testMode ? 't.partial(' : 'Partial<') : ''}`;
  code += `${testMode ? normalizeTest(typeName) : typeName}`;
  code += `${partial ? (testMode ? '.type.props)' : '>') : ''}`;
  return code;
}

/**
 * Custom Field Comparision Function
 */
function equalCheck(value1, value2, index) {
  if (index) {
    if (['optional', 'description', 'default', 'partial'].includes(index)) {
      return true;
    } else if (index === 'values') {
      if (!value1 || !value2) {
        return true;
      }
    }
  }

  if (isPlainObject(value1) && isPlainObject(value2)) {
    for (const key in value1) {
      if (!equalCheck(value1[key], value2[key], key)) {
        return false;
      }
    }
  } else {
    return isEqual(value1, value2);
  }

  return true;
}
