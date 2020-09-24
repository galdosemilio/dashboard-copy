/**
 * GET /schedule/summary
 */

export interface GetSummarySchedulerRequest {
  /** The account to calculate summary for. */
  account: string;
  /** Calculate from this date - YYYY-MM-DD format. */
  startDate: string;
  /** Calculate until this date - YYYY-MM-DD format. */
  endDate: string;
}
