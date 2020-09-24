/**
 * GET /measurement/sleep/summary
 */

import { createTest, createValidator } from '@coachcare/backend/tests';
import * as t from 'io-ts';
import { measurementSleepSummary } from '../../../shared/index.test';
import { GetAllWithSummaryMeasurementSleepResponse } from './getAllWithSummaryMeasurementSleep.response';

export const getAllWithSummaryMeasurementSleepResponse = createTest<
  GetAllWithSummaryMeasurementSleepResponse
>('GetAllWithSummaryMeasurementSleepResponse', {
  /** Array of measurement objects. */
  data: t.array(
    createValidator({
      /** The start date for the returning result set in 'YYYY-MM-DD' format. */
      date: t.string,
      /** The total number of minutes slept on the date. */
      sleepMinutes: t.number,
      /** The average number of minutes slept over all sleep periods on the date. */
      averageMinutes: t.number,
      /** The average sleep quality over all sleep periods on the date. */
      sleepQuality: t.string
    })
  ),
  /** Summary Object. */
  summary: measurementSleepSummary
});
