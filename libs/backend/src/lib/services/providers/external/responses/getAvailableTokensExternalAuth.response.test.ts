/**
 * GET /authentication/:account
 */

import { createTest } from '@coachcare/backend/tests';
import * as t from 'io-ts';
import { authSegment } from '../../../shared/index.test';
import { GetAvailableTokensExternalAuthResponse } from './getAvailableTokensExternalAuth.response';

export const getAvailableTokensExternalAuthResponse = createTest<
  GetAvailableTokensExternalAuthResponse
>('GetAvailableTokensExternalAuthResponse', {
  /** Array of token objects for an account. */
  data: t.array(authSegment)
});
