/**
 * GET /measurement/activity/summary
 */

import { createTest } from '@coachcare/backend/tests';
import * as t from 'io-ts';
import { measurementActivitySegment, pagination } from '../../../shared/index.test';
import { GetSummaryMeasurementActivityResponse } from './getSummaryMeasurementActivity.response';

export const getSummaryMeasurementActivityResponse = createTest<
  GetSummaryMeasurementActivityResponse
>('GetSummaryMeasurementActivityResponse', {
  /** Array of the aggregated dates. */
  data: t.array(measurementActivitySegment),
  /** Pagination object. */
  pagination: pagination
});
