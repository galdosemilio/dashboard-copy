/**
 * GET /available/match
 */

import { createTest } from '@coachcare/backend/tests';
import * as t from 'io-ts';
import { GetProvidersScheduleAvailableResponse } from './getProvidersScheduleAvailable.response';

export const getProvidersScheduleAvailableResponse = createTest<
  GetProvidersScheduleAvailableResponse
>('GetProvidersScheduleAvailableResponse', {
  /** Array of providers account IDs with available time. */
  providers: t.array(t.string)
});
