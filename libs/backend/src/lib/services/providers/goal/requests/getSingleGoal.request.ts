/**
 * GET /goal
 */

export interface GetSingleGoalRequest {
  /** Only fetch goal records which are associated with this account. Optional for Client requests, otherwise required. */
  account?: string;
}
