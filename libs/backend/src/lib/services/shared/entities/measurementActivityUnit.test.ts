/**
 * measurementActivityUnit
 */

import * as t from 'io-ts';

export const measurementActivityUnit = t.union([
  t.literal('day'),
  t.literal('week'),
  t.literal('month')
]);
