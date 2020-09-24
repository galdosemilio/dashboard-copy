/**
 * activityReportSortProperty
 */

import * as t from 'io-ts';

export const activityReportSortProperty = t.union([
  t.literal('activityLevel'),
  t.literal('provider'),
  t.literal('name')
]);
