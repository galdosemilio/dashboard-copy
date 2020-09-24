/**
 * POST /measurement/activity
 */

export interface AddMeasurementActivityRequest {
  /** The account ID of the client to add the measurement for. */
  clientId: string;
  /** Array of objects, each representing a single activity record. */
  activity: Array<{
    /** The day for this activity measurement, in YYYY-MM-DD format. */
    date: string;
    /** The id of the device type.  The Selvera tracker is device id 4. */
    device: number;
    /** The number of steps taken. */
    steps: number;
    /** The timezone of the user when the measurement was recorded.  For example 'America/New_York'. */
    timezone?: string;
    /** The distanced moved during the day, in meters. */
    distance?: number;
    /** The number of calories burned during the day, in kilocalories. */
    calories?: number;
    /** The elevation of the user when recording the measurement, in meters. */
    elevation?: number;
    /** The number of steps taken at a soft effort level. */
    soft?: number;
    /** The number of steps taken at a moderate effort level. */
    moderate?: number;
    /** The number of steps taken at an intense effort level. */
    intense?: number;
  }>;
}
