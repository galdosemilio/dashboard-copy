/**
 * accSortProperty
 */

import * as t from 'io-ts';

export const accSortProperty = t.union([
  t.literal('createdAt'),
  t.literal('email'),
  t.literal('firstName'),
  t.literal('lastName')
]);
