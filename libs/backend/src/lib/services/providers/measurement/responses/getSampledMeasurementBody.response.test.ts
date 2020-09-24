/**
 * GET /measurement/body/sampled
 */

import { createTest } from '@coachcare/backend/tests';
import * as t from 'io-ts';
import { sampledEntry } from '../../../shared/index.test';
import { GetSampledMeasurementBodyResponse } from './getSampledMeasurementBody.response';

export const getSampledMeasurementBodyResponse = createTest<GetSampledMeasurementBodyResponse>(
  'GetSampledMeasurementBodyResponse',
  {
    /** Collection of sampled measurement entries. */
    data: t.array(sampledEntry)
  }
);
