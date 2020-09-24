/**
 * GET /warehouse/organization/activity/feature
 */

import { createTest } from '@coachcare/backend/tests';
import * as t from 'io-ts';
import { GetUserActivityReportsResponse } from './getUserActivityReports.response';

export const getUserActivityReportsResponse = createTest<GetUserActivityReportsResponse>(
  'GetUserActivityReportsResponse',
  {
    /** Date of the aggregation. */
    aggregates: t.string
  }
);
