/**
 * sleepReportSortProperty
 */

import * as t from 'io-ts';

export const sleepReportSortProperty = t.union([
  t.literal('hourSum'),
  t.literal('hourMin'),
  t.literal('hourMax'),
  t.literal('hourAvg'),
  t.literal('provider'),
  t.literal('name')
]);
