import { omit } from 'lodash';
import { ApiField, ApiMap } from '../parser/api';

/**
 * Available Entities
 */

export const entitiesMap: ApiMap<ApiField> = {
  // preloaded entities
  OrgRef: {
    type: 'OrgRef',
    children: {
      id: { type: 'String/Number' }, // FIXME backend consistency
      name: { type: 'String' }
    }
  },
  OrgEntity: {
    type: 'OrgEntity',
    children: {
      id: { type: 'Bigint' },
      name: { type: 'String' },
      shortcode: { type: 'String' },
      hierarchyPath: { type: 'Bigint[]' }
    }
  },
  FormRef: {
    type: 'FormRef',
    children: {
      id: { type: 'Bigint' },
      organization: { type: 'Bigint' }
    }
  }
};

export const extendsMap: ApiMap<string> = {};

export const overrideMap: ApiMap<string> = {
  // Special Cases
  'Date/Null/00:00:00': 'String/Null',
  'Long/String': 'String/Number',
  'String/Long': 'String/Number',
  'Null/String': 'String/Null',
  'String/Base64': 'String'
};

export const typesMap: ApiMap<string> = {
  // Core
  String: 'string',
  Boolean: 'boolean',
  Number: 'number',
  Null: 'null',
  Void: 'void',
  // Types
  Mixed: 'any',
  Bigint: 'string',
  Integer: 'number',
  Timestamp: 'string', // with timezone
  Date: 'string',
  Time: 'string',
  DateTime: 'string',
  Interval: 'string', // hh:mm:ss
  Long: 'number',
  Float: 'number',
  PositiveNumeric: 'number'
};

export const sharedMap: Array<string> = [];

export const coreTypes = [
  'Any',
  'Bigint',
  'Bigint[]',
  'Boolean',
  'Float',
  'Integer',
  'Number',
  'Number[]',
  'String',
  'String[]'
];

export function setGenericTypes(genericTypes: string[]) {
  sharedMap.push.apply(sharedMap, genericTypes);
  for (const genericType of genericTypes) {
    typesMap[genericType] = genericType;
  }
}

export function processExtensibleType(typeName: string, field: ApiField) {
  const baseTypes = [
    'Object',
    'Array',
    'Mixed',
    'Null',
    'Date',
    'Time',
    'DateTime',
    'Timestamp',
    'Interval',
    'void'
  ];

  if (
    !coreTypes.includes(typeName) &&
    !typeName.endsWith('Sort') &&
    !typeName.endsWith('[]') &&
    !typeName.includes('/') &&
    !baseTypes.includes(typeName)
  ) {
    for (const entity in entitiesMap) {
      if (typeName !== entity && typeName.startsWith(entity)) {
        extendsMap[typeName] = entity;
        const parent = entitiesMap[entity].children as ApiMap<ApiField>;
        field.children = omit(field.children, Object.keys(parent));
      }
    }
    if (extendsMap[typeName]) {
      console.log(`EXTENDED: ${typeName} extends ${extendsMap[typeName]}`);
    } else {
      for (const entity of sharedMap) {
        if (typeName !== entity && typeName.startsWith(entity)) {
          console.log('UNEXTENDED SHARED: ', extendsMap[typeName], typeName, field);
        }
      }
      // console.log('TYPE: ', typeName);
    }
  }
}
