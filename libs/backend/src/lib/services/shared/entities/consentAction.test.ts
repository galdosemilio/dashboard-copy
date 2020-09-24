/**
 * consentAction
 */

import * as t from 'io-ts';

export const consentAction = t.union([
  t.literal('accepted'),
  t.literal('rejected'),
  t.literal('pending')
]);
