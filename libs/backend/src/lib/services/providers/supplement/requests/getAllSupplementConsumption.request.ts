/**
 * GET /supplement/consumption
 */

export interface GetAllSupplementConsumptionRequest {
  /** Only fetch supplement intake which are associated with this account. Optional for Client requests, otherwise required. */
  account?: string;
  /** Date passed as the start time being passed, if not passed, defaults to current day. */
  startDate?: string;
  /** Date passed as the end time being passed. */
  endDate?: string;
  /** Number of entries to offset from beginning of query. */
  offset?: number;
}
