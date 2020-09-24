/**
 * meetingTypeCode
 */

import * as t from 'io-ts';

export const meetingTypeCode = t.union([
  t.literal('1on1initial'),
  t.literal('1on1'),
  t.literal('circle'),
  t.literal('busy'),
  t.literal('google'),
  t.literal('selvera')
]);
