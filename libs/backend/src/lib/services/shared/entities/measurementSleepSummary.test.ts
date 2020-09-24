/**
 * measurementSleepSummary
 */

import { createValidator } from '@coachcare/backend/tests';
import * as t from 'io-ts';

export const measurementSleepSummary = createValidator({
  /** The minimum average value returned for the result set. */
  sleepMinutesMin: t.number,
  /** The average value returned for the result set. */
  sleepMinutesMax: t.number,
  /**
   * The start time of the previous record where sleep was recorded.
   * If there are no sleep measurements, will be '00:00:00'; if not defined for last sleep measurement, will be null.
   */
  previousSleepStart: t.union([t.string, t.null]),
  /** The end time of the previous record where sleep was recorded. Has same exceptional behavior as summary.previousSleepStart. */
  previousSleepEnd: t.union([t.string, t.null]),
  /** The total amount of time slept for the previous record where sleep was recorded. */
  previousSleepTotal: t.number,
  /** The average sleep quality for the result set. */
  sleepQualityAverage: t.number
});
