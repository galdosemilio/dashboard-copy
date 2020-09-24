/**
 * GET /warehouse/organization/sign-ups/timeline
 */

import { createTest, createValidator } from '@coachcare/backend/tests';
import * as t from 'io-ts';
import { GetSignUpsTimelineReportsResponse } from './getSignUpsTimelineReports.response';

export const getSignUpsTimelineReportsResponse = createTest<GetSignUpsTimelineReportsResponse>(
  'GetSignUpsTimelineReportsResponse',
  {
    /** Array of report results. */
    data: t.array(
      createValidator({
        /** Date of the aggregation. */
        date: t.string,
        /** All aggregates for specific dates. */
        aggregates: t.array(
          createValidator({
            /** Organization object. */
            organization: createValidator({
              /** The id of organization. */
              id: t.string,
              /** The name of organization. */
              name: t.string
            }),
            /** A number of new sign ups. */
            signUps: t.string
          })
        )
      })
    )
  }
);
