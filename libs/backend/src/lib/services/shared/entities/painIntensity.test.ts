/**
 * painIntensity
 */

import * as t from 'io-ts';

export const painIntensity = t.union([
  t.literal(0),
  t.literal(1),
  t.literal(2),
  t.literal(3),
  t.literal(4),
  t.literal(5),
  t.literal(6),
  t.literal(7),
  t.literal(8),
  t.literal(9),
  t.literal(10)
]);
