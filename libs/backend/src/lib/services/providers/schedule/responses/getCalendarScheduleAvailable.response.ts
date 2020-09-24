/**
 * GET /available/calendar
 */

import { ScheduleCalendarSegment } from '../../../shared';

export interface GetCalendarScheduleAvailableResponse {
  /** Calendar availability entries. */
  entries: Array<ScheduleCalendarSegment>;
}
