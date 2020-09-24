/**
 * GET /authentication/google
 */

import { createTest } from '@coachcare/backend/tests';
import * as t from 'io-ts';
import { AuthGoogleExternalAuthResponse } from './authGoogleExternalAuth.response';

export const authGoogleExternalAuthResponse = createTest<AuthGoogleExternalAuthResponse>(
  'AuthGoogleExternalAuthResponse',
  {
    /** Url for redirect to google auth service. */
    url: t.string
  }
);
