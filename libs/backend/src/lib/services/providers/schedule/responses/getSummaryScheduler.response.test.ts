/**
 * GET /schedule/summary
 */

import { createTest } from '@coachcare/backend/tests';
import * as t from 'io-ts';
import { GetSummarySchedulerResponse } from './getSummaryScheduler.response';

export const getSummarySchedulerResponse = createTest<GetSummarySchedulerResponse>(
  'GetSummarySchedulerResponse',
  {
    /** The number of minutes used for initial 1on1 meetings. */
    '1on1initialMinutes': t.number,
    /** The number of booked and attended sessions for initial 1on1 meetings. */
    '1on1initialSessions': t.number,
    /** The number of minutes used for 1on1 meetings. */
    '1on1Minutes': t.number,
    /** The number of booked and attended sessions for 1on1 meetings. */
    '1on1Sessions': t.number,
    /** The number of minutes used for circle meetings. */
    circleMinutes: t.number,
    /** The number of booked and attended sessions for circle meetings. */
    circleSession: t.number
  }
);
