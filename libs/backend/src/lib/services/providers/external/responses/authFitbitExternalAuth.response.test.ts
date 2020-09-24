/**
 * GET /authentication/fitbit
 */

import { createTest } from '@coachcare/backend/tests';
import * as t from 'io-ts';
import { AuthFitbitExternalAuthResponse } from './authFitbitExternalAuth.response';

export const authFitbitExternalAuthResponse = createTest<AuthFitbitExternalAuthResponse>(
  'AuthFitbitExternalAuthResponse',
  {
    /** Url for redirect to fitbit auth service. */
    url: t.string
  }
);
