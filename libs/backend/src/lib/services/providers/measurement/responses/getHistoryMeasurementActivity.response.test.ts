/**
 * GET /measurement/activity/history
 */

import { createTest, createValidator } from '@coachcare/backend/tests';
import * as t from 'io-ts';
import { GetHistoryMeasurementActivityResponse } from './getHistoryMeasurementActivity.response';

export const getHistoryMeasurementActivityResponse = createTest<
  GetHistoryMeasurementActivityResponse
>('GetHistoryMeasurementActivityResponse', {
  /** Array of activity objects, ordered with date descending. */
  history: t.array(
    createValidator({
      /** The day for which this activity profile records. */
      date: t.string,
      /** The time at which the measurement was stored in the database. */
      recordedAt: t.string
    })
  )
});
