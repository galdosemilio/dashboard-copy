/**
 * authServiceName
 */

import * as t from 'io-ts';

export const authServiceName = t.union([
  t.literal('fitbit'),
  t.literal('google'),
  t.literal('levl'),
  t.literal('healthkit')
]);
