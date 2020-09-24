/**
 * accAccessSortProperty
 */

import * as t from 'io-ts';

export const accAccessSortProperty = t.union([
  t.literal('createdAt'),
  t.literal('email'),
  t.literal('firstName'),
  t.literal('lastName'),
  t.literal('associationDate')
]);
