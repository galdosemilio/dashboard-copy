/**
 * GET /measurement/body/summary
 */

import { createTest } from '@coachcare/backend/tests';
import * as t from 'io-ts';
import { summaryPair } from '../../../shared/index.test';
import { GetSummaryMeasurementBodyResponse } from './getSummaryMeasurementBody.response';

export const getSummaryMeasurementBodyResponse = createTest<GetSummaryMeasurementBodyResponse>(
  'GetSummaryMeasurementBodyResponse',
  {
    /**
     * Summary item collection. Essentially a map/dictionary between summary property and the value.
     * Properties that do not have any data recorded for them will not be included in the collection.
     */
    data: t.array(summaryPair)
  }
);
