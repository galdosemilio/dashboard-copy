/**
 * availabilityLookup
 */

import * as t from 'io-ts';

export const availabilityLookup = t.union([
  t.literal('morning'),
  t.literal('afternoon'),
  t.literal('evening')
]);
