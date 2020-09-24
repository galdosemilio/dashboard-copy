/**
 * GET /conference/video/call/availability
 */

import { createTest } from '@coachcare/backend/tests';
import * as t from 'io-ts';
import { GetAvailabilityConferenceCallResponse } from './getAvailabilityConferenceCall.response';

export const getAvailabilityConferenceCallResponse = createTest<
  GetAvailabilityConferenceCallResponse
>('GetAvailabilityConferenceCallResponse', {
  /**
   * A flag indicating whether the selected account is available on a call.
   * If set to `false`, it means the account is on another call.
   */
  isAvailable: t.boolean
});
