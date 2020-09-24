/**
 * GET /warehouse/provider/count
 */

import { createTest, createValidator } from '@coachcare/backend/tests';
import * as t from 'io-ts';
import { GetProviderCountReportsResponse } from './getProviderCountReports.response';

export const getProviderCountReportsResponse = createTest<GetProviderCountReportsResponse>(
  'GetProviderCountReportsResponse',
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
            /** A number of active providers. */
            count: t.string
          })
        )
      })
    )
  }
);
