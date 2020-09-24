/**
 * GET /hydration
 */

export interface GetAllHydrationRequest {
  /** The account of the user. Optional for Client requests, otherwise required. */
  account?: string;
  /** Date passed as the start time being passed, if not passed, defaults to current day. YYYY-MM-DD format. */
  startDate?: string;
  /** Date passed as the end time being passed. YYYY-MM-DD format. */
  endDate?: string;
  /** The order to return the data in (dateAsc|dateDesc).  Defaults to dateAsc. */
  order?: string;
  /** Number of entries to offset from beginning of query. */
  offset?: number;
}
