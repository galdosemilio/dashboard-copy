/**
 * GET /measurement/activity/detailed
 */

export type GetDetailedMeasurementActivityResponse = Array<{
  /** The start time of this activity segment. */
  activity_start: string;
  /** The level of activity, 0 is least active and 100 is most active. */
  activity_level: number;
}>;
