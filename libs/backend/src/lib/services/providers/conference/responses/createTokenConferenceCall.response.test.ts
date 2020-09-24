/**
 * POST /conference/video/token
 */

import { createTest } from '@coachcare/backend/tests';
import * as t from 'io-ts';
import { CreateTokenConferenceCallResponse } from './createTokenConferenceCall.response';

export const createTokenConferenceCallResponse = createTest<CreateTokenConferenceCallResponse>(
  'CreateTokenConferenceCallResponse',
  {
    /** Stringified JWT access token. */
    jwt: t.string
  }
);
