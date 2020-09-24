/**
 * POST /login
 */

import { createTest, optional } from '@coachcare/backend/tests';
import * as t from 'io-ts';
import { accountTypeId } from '../../../shared/index.test';
import { LoginSessionResponse } from './loginSession.response';

export const loginSessionResponse = createTest<LoginSessionResponse>('LoginSessionResponse', {
  /** Account type of the logged user. */
  accountType: accountTypeId,
  /** Session token. If deviceType is Web the cookie is set and the token is not returned. */
  token: optional(t.string)
});
