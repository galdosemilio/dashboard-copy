/**
 * GET /measurement/sleep/summary
 */

export interface GetAllWithSummaryMeasurementSleepRequest {
  /** The client id. */
  clientId: string;
  /** An array of data columns being filtered through. */
  data: 'total' | 'average' | 'sleepQuality';
  /** Select sleep dates that are on or after this date, in 'YYYY-MM-DD' format. */
  startDate: string;
  /** Select sleep dates that are on or before this date, in 'YYYY-MM-DD' format. */
  endDate?: string;
  /** Maximum number of results. Can be set to 'all' to include all entries. */
  max?: any;
  /** The unit of time that the results should be returned in. */
  unit: string;
}
