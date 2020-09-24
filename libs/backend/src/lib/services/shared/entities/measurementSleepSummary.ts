/**
 * MeasurementSleepSummary
 */

export interface MeasurementSleepSummary {
  /** The minimum average value returned for the result set. */
  sleepMinutesMin: number;
  /** The average value returned for the result set. */
  sleepMinutesMax: number;
  /**
   * The start time of the previous record where sleep was recorded.
   * If there are no sleep measurements, will be '00:00:00'; if not defined for last sleep measurement, will be null.
   */
  previousSleepStart: string | null;
  /** The end time of the previous record where sleep was recorded. Has same exceptional behavior as summary.previousSleepStart. */
  previousSleepEnd: string | null;
  /** The total amount of time slept for the previous record where sleep was recorded. */
  previousSleepTotal: number;
  /** The average sleep quality for the result set. */
  sleepQualityAverage: number;
}
