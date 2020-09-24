/**
 * calendarViewType
 */

import * as t from 'io-ts';

export const calendarViewType = t.union([
  t.literal('list'),
  t.literal('calendar:month'),
  t.literal('calendar:day')
]);
