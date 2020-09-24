/**
 * measurementPreferenceType
 */

import * as t from 'io-ts';

export const measurementPreferenceType = t.union([
  t.literal('us'),
  t.literal('uk'),
  t.literal('metric')
]);
