/**
 * ActivitySegment
 */

export interface ActivitySegment {
  /** The id of this measurement entry. */
  id: number;
  /** The id of the user to which this measurement belongs. */
  user_id: number;
  /** The time this measurement was stored in the database. */
  recorded_at: string;
  /** The day for which this activity profile records. */
  activity_date: string;
  /** The timezone the user was in when they recorded the activity. */
  timezone: string;
  /** The number of steps the user took this day. */
  steps: number;
  /** The total distance in meters walked during this day. */
  distance: number;
  /** The total calories burned in KiloCalories during this day. */
  calories: number;
  /** The elevation of the user when the reading was taken. */
  elevation: number;
  /** Number of second spent performing physically soft activity. */
  soft: number;
  /** Number of second spent performing physically moderate activity. */
  moderate: number;
  /** Number of second spent performing physically hard activity. */
  intense: number;
  /** The device which took these measurements, matches up to the measurement_devices table. */
  source: number;
}
