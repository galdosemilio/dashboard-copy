/**
 * summaryProperty
 */

import * as t from 'io-ts';

export const summaryProperty = t.union([
  t.literal('bmi'),
  t.literal('weight'),
  t.literal('bodyFat'),
  t.literal('hydration'),
  t.literal('leanMass')
]);
