/**
 * GET /warehouse/step/activity/level
 */

import { createTest, createValidator, optional } from '@coachcare/backend/tests';
import * as t from 'io-ts';
import { pagination } from '../../../shared/index.test';
import { GetActivityLevelReportsResponse } from './getActivityLevelReports.response';

export const getActivityLevelReportsResponse = createTest<GetActivityLevelReportsResponse>(
  'GetActivityLevelReportsResponse',
  {
    /** Data collection. */
    data: t.array(
      createValidator({
        /** User account data. */
        account: createValidator({
          /** User ID. */
          id: t.string,
          /** First name of the client. */
          firstName: t.string,
          /** Last name of the client. */
          lastName: t.string
        }),
        /** Organization data. */
        organization: createValidator({
          /** Organization ID. */
          id: t.string,
          /** Organization name. */
          name: t.string
        }),
        /** Steps data. */
        steps: createValidator({
          /** Average steps (daily) for given time range. */
          avg: t.number,
          /** Minimum steps (daily) for given time range. */
          min: t.number,
          /** Maximum steps (daily) for given time range. */
          max: t.number,
          /** Number of samples for given time range. */
          sampleCount: t.number
        }),
        /** Level data. */
        level: createValidator({
          /** assigned level ID. */
          name: t.string
        }),
        /** Assigned provider data. */
        assignedProvider: optional(
          createValidator({
            /** Provider account ID. */
            id: t.string,
            /** First name of the provider. */
            firstName: t.string,
            /** Last name of the provider. */
            lastName: t.string
          })
        )
      })
    ),
    /** Pagination object. */
    pagination: pagination
  }
);
