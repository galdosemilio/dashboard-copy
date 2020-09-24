/**
 * loggingLevel
 */

import * as t from 'io-ts';

export const loggingLevel = t.union([
  t.literal('trace'),
  t.literal('debug'),
  t.literal('info'),
  t.literal('warning'),
  t.literal('error'),
  t.literal('fatal')
]);
