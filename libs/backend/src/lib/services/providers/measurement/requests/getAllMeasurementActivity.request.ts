/**
 * GET /measurement/activity
 */

export interface GetAllMeasurementActivityRequest {
  /** The user id to fetch measurements for. This is auto-populated for clients. */
  clientId: string;
  /** Fetch measurements starting at this date, in YYYY-MM-DD format. */
  start_date?: string;
  /** Fetch measurements up until and including this date, in YYYY-MM-DD format. */
  end_date?: string;
  /** Fetches measurements for a particular device type. If blank results will return all measurements. */
  device?: number;
  /** Maximum number of measurements to fetch. If omitted or NULL, no limit will be set. */
  max?: number;
  /** Direction to sort the results in (asc|desc) on the recorded_at column.  Defaults to asc. */
  direction?: string;
}
