/**
 * POST /measurement/sleep
 */

export interface CreateMeasurementSleepRequest {
  /** The account of the user to add sleep for (required for providers, ignored for clients) */
  clientId: string;
  /** The device which took these measurements. */
  deviceId: string;
  /** Array of days contain sleep data. */
  sleep: Array<{
    /**
     * Array (not named!) of objects containing 15 minute sleep segment data for a single continuous day/sleep segment.
     * All sleep segments should be in chronological order.  Also, an entry must exist for each 15 minute segment.
     */
    day: Array<{
      /** The start time of this 15-minute sleep segment, in ISO 8601 format. */
      time: string;
      /** The quality of the sleep. */
      quality: number;
    }>;
  }>;
}
