/**
 * weigthChangeSortProperty
 */

import * as t from 'io-ts';

export const weigthChangeSortProperty = t.union([
  t.literal('percentage'),
  t.literal('value'),
  t.literal('provider'),
  t.literal('name')
]);
