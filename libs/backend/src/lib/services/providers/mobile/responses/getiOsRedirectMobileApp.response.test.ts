/**
 * GET /app/ios/:id
 */

import { createTest } from '@coachcare/backend/tests';
import * as t from 'io-ts';
import { GetiOSRedirectMobileAppResponse } from './getiOsRedirectMobileApp.response';

export const getiOSRedirectMobileAppResponse = createTest<GetiOSRedirectMobileAppResponse>(
  'GetiOSRedirectMobileAppResponse',
  {
    /** Redirect URL. */
    redirect: t.string
  }
);
