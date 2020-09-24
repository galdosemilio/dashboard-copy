/**
 * signUpsReportSortProperty
 */

import * as t from 'io-ts';

export const signUpsReportSortProperty = t.union([
  t.literal('percentage'),
  t.literal('value'),
  t.literal('provider'),
  t.literal('name'),
  t.literal('startDate')
]);
