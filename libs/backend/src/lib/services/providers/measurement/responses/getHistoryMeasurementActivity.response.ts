/**
 * GET /measurement/activity/history
 */

export interface GetHistoryMeasurementActivityResponse {
  /** Array of activity objects, ordered with date descending. */
  history: Array<{
    /** The day for which this activity profile records. */
    date: string;
    /** The time at which the measurement was stored in the database. */
    recordedAt: string;
  }>;
}
