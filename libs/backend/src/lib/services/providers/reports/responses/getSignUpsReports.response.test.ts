/**
 * GET /warehouse/organization/sign-ups
 */

import { createTest, createValidator } from '@coachcare/backend/tests';
import * as t from 'io-ts';
import { GetSignUpsReportsResponse } from './getSignUpsReports.response';

export const getSignUpsReportsResponse = createTest<GetSignUpsReportsResponse>(
  'GetSignUpsReportsResponse',
  {
    /** Array of report results. */
    data: t.array(
      createValidator({
        /** Organization data. */
        organization: createValidator({
          /** Organization ID. */
          id: t.string,
          /** Organization name. */
          name: t.string
        }),
        /** A number of new sign ups. */
        signUps: t.string
      })
    )
  }
);
