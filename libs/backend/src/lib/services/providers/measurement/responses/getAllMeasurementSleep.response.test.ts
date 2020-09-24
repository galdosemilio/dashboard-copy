/**
 * GET /measurement/sleep
 */

import { createTest, createValidator } from '@coachcare/backend/tests';
import * as t from 'io-ts';
import { GetAllMeasurementSleepResponse } from './getAllMeasurementSleep.response';

export const getAllMeasurementSleepResponse = createTest<GetAllMeasurementSleepResponse>(
  'GetAllMeasurementSleepResponse',
  {
    /** Sleep measurement object. */
    sleepObject: t.array(
      createValidator({
        /** The id of this measurement entry. */
        id: t.number,
        /** The id of the user to which this measurement belongs. */
        user_id: t.number,
        /** The time this measurement was stored in the database. */
        recorded_at: t.string,
        /** The day for which this sleep records. */
        sleep_date: t.string,
        /** The timezone the user was in when they recorded the sleep. */
        timezone: t.string,
        /** The time the sleep started. */
        sleep_start: t.string,
        /** The time the sleep ended. */
        sleep_end: t.string,
        /** The total number of seconds of the sleep. */
        total: t.number,
        /** Number of seconds it took to fall asleep. */
        time_to_sleep: t.number,
        /** Number of seconds spent waking up. */
        wake_up_count: t.number,
        /** Number of seconds spent in deep sleep. */
        deep_sleep: t.number,
        /** Number of seconds spent woken up. */
        wake_up: t.number,
        /** Number of seconds spent in light sleep. */
        light_sleep: t.number,
        /** Number of seconds spent in REM sleep. */
        rem_sleep: t.number,
        /** The device which took these measurements, matches up to the measurement_devices table. */
        source: t.number
      })
    )
  }
);
