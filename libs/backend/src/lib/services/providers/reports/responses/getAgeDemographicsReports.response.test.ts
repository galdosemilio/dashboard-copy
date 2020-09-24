/**
 * GET /warehouse/demographics/age
 */

import { createTest } from '@coachcare/backend/tests';
import * as t from 'io-ts';
import { bucketReported } from '../../../shared/index.test';
import { GetAgeDemographicsReportsResponse } from './getAgeDemographicsReports.response';

export const getAgeDemographicsReportsResponse = createTest<GetAgeDemographicsReportsResponse>(
  'GetAgeDemographicsReportsResponse',
  {
    /** Aggregate collection. */
    data: t.array(bucketReported)
  }
);
