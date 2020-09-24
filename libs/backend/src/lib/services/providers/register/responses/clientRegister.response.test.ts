/**
 * POST /client/register
 */

import { createTest, optional } from '@coachcare/backend/tests';
import * as t from 'io-ts';
import { ClientRegisterResponse } from './clientRegister.response';

export const clientRegisterResponse = createTest<ClientRegisterResponse>('ClientRegisterResponse', {
  /** The id of this user. */
  id: t.string,
  /** The authentication token for this user, returned for device types other than Web. */
  token: optional(t.string)
});
