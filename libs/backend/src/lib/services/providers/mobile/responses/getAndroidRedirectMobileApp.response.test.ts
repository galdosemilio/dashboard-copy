/**
 * GET /app/android/:id
 */

import { createTest } from '@coachcare/backend/tests';
import * as t from 'io-ts';
import { GetAndroidRedirectMobileAppResponse } from './getAndroidRedirectMobileApp.response';

export const getAndroidRedirectMobileAppResponse = createTest<GetAndroidRedirectMobileAppResponse>(
  'GetAndroidRedirectMobileAppResponse',
  {
    /** Redirect URL. */
    redirect: t.string
  }
);
