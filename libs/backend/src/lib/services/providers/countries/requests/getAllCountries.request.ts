/**
 * GET /country
 */

import { PageOffset, PageSize } from '../../../shared';

export interface GetAllCountriesRequest {
  /** Query to filter by. */
  query?: string;
  /** Page size. Can either be "all" (a string) or a number. */
  limit?: PageSize;
  /** Number of items to offset from beginning of the result set. */
  offset?: PageOffset;
}
