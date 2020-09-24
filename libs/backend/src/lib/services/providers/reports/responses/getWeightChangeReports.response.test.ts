/**
 * GET /warehouse/weight/change
 */

import { createTest, createValidator, optional } from '@coachcare/backend/tests';
import * as t from 'io-ts';
import { pagination } from '../../../shared/index.test';
import { GetWeightChangeReportsResponse } from './getWeightChangeReports.response';

export const getWeightChangeReportsResponse = createTest<GetWeightChangeReportsResponse>(
  'GetWeightChangeReportsResponse',
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
        /** Weight change data. */
        change: createValidator({
          /** Absolute value of the weight change between the first & last weigh in the provided date range. */
          value: t.string,
          /** Percentage change of the weight, in respect to starting weight, between the first & last weigh in the provided date range. */
          percentage: t.string,
          /** Count of weigh-ins (samples) in the given date range. */
          weighInCount: t.string
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
