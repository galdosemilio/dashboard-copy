/**
 * GET /warehouse/organization/sign-ups/list
 */

import { createTest, createValidator, optional } from '@coachcare/backend/tests';
import * as t from 'io-ts';
import { pagination } from '../../../shared/index.test';
import { GetSignUpsListReportsResponse } from './getSignUpsListReports.response';

export const getSignUpsListReportsResponse = createTest<GetSignUpsListReportsResponse>(
  'GetSignUpsListReportsResponse',
  {
    /** Data collection. */
    data: t.array(
      createValidator({
        /** Organization object. */
        organization: createValidator({
          /** The id of organization. */
          id: t.string,
          /** The name of organization. */
          name: t.string
        }),
        /** Client object. */
        account: createValidator({
          /** The id of client. */
          id: t.string,
          /** The first name of client. */
          firstName: t.string,
          /** The last name of client. */
          lastName: t.string
        }),
        /** Provider object. */
        assignedProvider: optional(
          createValidator({
            /** The id of provider. */
            id: optional(t.string),
            /** The first name of provider. */
            firstName: optional(t.string),
            /** The last name of provider. */
            lastName: optional(t.string)
          })
        ),
        /** Client association date. */
        startDate: t.string,
        /** Difference in weeks, fractional, between client's start date and selected endDate. */
        length: t.number
      })
    ),
    /** Pagination object. */
    pagination: pagination
  }
);
