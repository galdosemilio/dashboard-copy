/**
 * activitySegment
 */

import { createValidator } from '@coachcare/backend/tests';
import * as t from 'io-ts';

export const activitySegment = createValidator({
  /** The id of this measurement entry. */
  id: t.number,
  /** The id of the user to which this measurement belongs. */
  user_id: t.number,
  /** The time this measurement was stored in the database. */
  recorded_at: t.string,
  /** The day for which this activity profile records. */
  activity_date: t.string,
  /** The timezone the user was in when they recorded the activity. */
  timezone: t.string,
  /** The number of steps the user took this day. */
  steps: t.number,
  /** The total distance in meters walked during this day. */
  distance: t.number,
  /** The total calories burned in KiloCalories during this day. */
  calories: t.number,
  /** The elevation of the user when the reading was taken. */
  elevation: t.number,
  /** Number of second spent performing physically soft activity. */
  soft: t.number,
  /** Number of second spent performing physically moderate activity. */
  moderate: t.number,
  /** Number of second spent performing physically hard activity. */
  intense: t.number,
  /** The device which took these measurements, matches up to the measurement_devices table. */
  source: t.number
});
