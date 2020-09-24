/**
 * GET /available/calendar
 */

import { createTest } from '@coachcare/backend/tests';
import * as t from 'io-ts';
import { scheduleCalendarSegment } from '../../../shared/index.test';
import { GetCalendarScheduleAvailableResponse } from './getCalendarScheduleAvailable.response';

export const getCalendarScheduleAvailableResponse = createTest<
  GetCalendarScheduleAvailableResponse
>('GetCalendarScheduleAvailableResponse', {
  /** Calendar availability entries. */
  entries: t.array(scheduleCalendarSegment)
});
