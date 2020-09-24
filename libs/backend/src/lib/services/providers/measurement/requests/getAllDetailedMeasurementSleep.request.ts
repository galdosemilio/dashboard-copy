/**
 * GET /measurement/sleep/detailed
 */

export interface GetAllDetailedMeasurementSleepRequest {
  /** The user id to fetch measurements for.  This is auto-populated for clients. */
  clientId?: string;
  /** Fetch measurements starting at this date, in YYYY-MM-DD format. */
  start_date?: string;
  /** Fetch measurements up until and including this date, in YYYY-MM-DD format. */
  end_date?: string;
}
