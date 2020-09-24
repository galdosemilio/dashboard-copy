/**
 * GET /supplement
 */

import { ActiveStatus, PageOffset, PageSize } from '../../../shared';

export interface GetAllSupplementRequest {
  /** Search query for retrieval of all matching supplements by short or full name. */
  query: string;
  /** Filter supplements by activity status. */
  status?: ActiveStatus;
  /** Number of records per page. Can either be "all" (a string) or a number. */
  limit?: PageSize;
  /** Number of records to offset. */
  offset?: PageOffset;
}
