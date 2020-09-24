/**
 * GET /measurement/activity/history
 */

export interface GetHistoryMeasurementActivityRequest {
  /** The client id. Optional for Client requests, otherwise required. */
  account?: string;
  /** Start date to search records for. */
  startDate: string;
  /** End date to search records for. */
  endDate: string;
  /** Measurement device id. */
  device?: string;
}
