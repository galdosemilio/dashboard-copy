/**
 * GET /warehouse/step/activity/level
 */

import { ActivityReportSort, PageOffset, PageSize } from '../../../shared';

export interface GetActivityLevelReportsRequest {
  /** The ID of the organization. */
  organization: string;
  /** Report with data that start at or after this time, in ISO8601 format. */
  startDate: string;
  /** Report with data that end at or before this time, in ISO8601 format. */
  endDate: string;
  /**
   * Array of levels of average steps per day to count to, for example:
   * [ { name: 'low', threshold: 0 }, { name: 'so-so', threshold: 1000 }, { name: 'acceptable', threshold: 4000 } ].
   */
  level: Array<{
    /** Name of level. */
    name: string;
    /** Threshold steps value of level, minimum value 0. */
    threshold: number;
  }>;
  /** Page size. Can either be "all" (a string) or a number. */
  limit?: PageSize;
  /** Page offset. */
  offset?: PageOffset;
  /** A collection of sorting options. The ordering is applied in the order of parameters passed. Defaults to sorting by name. */
  sort?: ActivityReportSort;
}
