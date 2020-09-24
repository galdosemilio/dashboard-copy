/**
 * GET /supplement/summary
 */

export interface GetSummarySupplementRequest {
  /** The client id. Optional for Client requests, otherwise required. */
  account?: string;
  /** Select data that starts at or after this time, in 'YYYY-MM-DD' format. */
  startDate: string;
  /** Select data that ends at or before this time, in 'YYYY-MM-DD' format. Todays date is default if left blank. */
  endDate?: string;
  /** The unit of time that the results should be returned in (day|week|month) */
  unit: string;
}
