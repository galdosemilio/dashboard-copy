/**
 * foodRegion
 */

import * as t from 'io-ts';

export const foodRegion = t.union([
  t.literal('US'),
  t.literal('CA'),
  t.literal('IL'),
  t.literal('AU'),
  t.literal('SA')
]);
