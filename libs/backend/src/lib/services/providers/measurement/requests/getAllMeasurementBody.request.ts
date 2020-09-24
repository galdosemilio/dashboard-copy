/**
 * GET /measurement/body
 */

export interface GetAllMeasurementBodyRequest {
  /** The client id. Optional for Client requests, otherwise required. */
  account?: string;
  /**
   * An array of data columns being filtered through.
   * The allowed columns are any of the optional inputs to Add user body measurements with the addition of 'bmi'.
   * (which is stored as 10,000 units, e.g. 37.25 would be stored as 3725) and the subtraction of 'height'.
   */
  data: Array<string>;
  /** Select measurements which were recorded at or after this date, in 'YYYY-MM-DD' format. */
  startDate: string;
  /** Select measurements which were recorded at or before this date, in 'YYYY-MM-DD' format. */
  endDate?: string;
  /**
   * Maximum number of dates returned in data array and considered for summary statistics (has no effect on oldest and previous)
   * Can be set to 'all' to include all entries.
   */
  max?: any;
  /** The unit of time that the results should be returned in. */
  unit: string;
  /** Type grouping results. */
  aggregation?: string;
}
