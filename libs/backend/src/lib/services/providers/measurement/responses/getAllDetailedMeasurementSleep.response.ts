/**
 * GET /measurement/sleep/detailed
 */

export interface GetAllDetailedMeasurementSleepResponse {
  /** Sleep measurement object. */
  sleepObject: Array<{
    /** The id of this measurement entry. */
    id: number;
    /** The id of the user to which this measurement belongs. */
    user_id: number;
    /** The time this measurement was stored in the database. */
    recorded_at: string;
    /** The day for which this sleep records. */
    sleep_date: string;
    /** The timezone the user was in when they recorded the sleep. */
    timezone: string;
    /** The time the sleep started. */
    sleep_start: string;
    /** The time the sleep ended. */
    sleep_end: string;
    /** The total number of seconds of the sleep. */
    total: number;
    /** Number of seconds it took to fall asleep. */
    time_to_sleep: number;
    /** Number of seconds spent waking up. */
    wake_up_count: number;
    /** Number of seconds spent in deep sleep. */
    deep_sleep: number;
    /** Number of seconds spent woken up. */
    wake_up: number;
    /** Number of seconds spent in light sleep. */
    light_sleep: number;
    /** Number of seconds spent in REM sleep. */
    rem_sleep: number;
    /** The device which took these measurements, matches up to the measurement_devices table. */
    source: number;
    /** Array of objects of 15 minute sleep segments. */
    detailed: Array<{
      /** Start of sleep segment. */
      sleep_start: string;
      /** Quality of sleep on a 1-100 scale.  1 is most restful and 100 is least restful. */
      sleep_quality: number;
    }>;
  }>;
}
