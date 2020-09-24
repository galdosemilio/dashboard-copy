/**
 * GET /food/consumed
 */

import { PageOffset, PageSize } from '../../../shared';

export interface GetAllFoodConsumedRequest {
  /** ID of the account being searched for. */
  account: string;
  /** Filter by the name of the meal. */
  query?: string;
  /** Fetch by consumed meal type id. */
  type?: number;
  /** Filters the result by consumedAt started from this timestamp. */
  start?: string;
  /** Filters the result by consumedAt finished before this timestamp. */
  end?: string;
  /** Page size. Can either be "all" (a string) or a number. */
  limit?: PageSize;
  /** Number of meals to offset from beginning of query. */
  offset?: PageOffset;
}
