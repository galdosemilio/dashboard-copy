/**
 * GET /pain-tracking/history
 */

import { PageOffset, PageSize } from '../../../shared';

export interface GetAllPainTrackingRequest {
  /** Account id of specified user. */
  account: string;
  /** start datetime with time zone. */
  startDate: string;
  /** end datetime with time zone, default=startDate. */
  endDate?: string;
  /** Page size. Can either be "all" (a string) or a number. */
  limit?: PageSize;
  /** Number of items to offset from beginning of the result set. */
  offset?: PageOffset;
}
