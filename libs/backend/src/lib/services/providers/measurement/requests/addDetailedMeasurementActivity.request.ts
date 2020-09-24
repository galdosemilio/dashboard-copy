/**
 * POST /measurement/activity/detailed
 */

export interface AddDetailedMeasurementActivityRequest {
  /** The id of the client. */
  clientId: string;
  /** Array objects of 15-minute activity segments. */
  activity: Array<{
    /** The start time of this 15-minute activity segment, in ISO 8601 format. */
    time: string;
    /** The activity rating during this period. */
    activity: number;
  }>;
}
