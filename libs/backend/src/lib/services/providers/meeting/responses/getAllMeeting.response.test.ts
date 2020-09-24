/**
 * GET /meeting
 */

import { createTest } from '@coachcare/backend/tests';
import * as t from 'io-ts';
import { meetingItem, pagination } from '../../../shared/index.test';
import { GetAllMeetingResponse } from './getAllMeeting.response';

export const getAllMeetingResponse = createTest<GetAllMeetingResponse>('GetAllMeetingResponse', {
  /** Array of meeting objects. */
  data: t.array(meetingItem),
  /** Pagination object. */
  pagination: pagination
});
