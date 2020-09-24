/**
 * GET /warehouse/measurement/body-composition
 */

import { createTest, createValidator } from '@coachcare/backend/tests';
import * as t from 'io-ts';
import { GetBodyCompositionReportsResponse } from './getBodyCompositionReports.response';

export const getBodyCompositionReportsResponse = createTest<GetBodyCompositionReportsResponse>(
  'GetBodyCompositionReportsResponse',
  {
    /** Data collection. */
    data: t.array(
      createValidator({
        /** Cohort week. */
        week: t.number,
        /** Average change of specific metric (value, percentage) of the selected data point. */
        avg: t.string,
        /** Organization data. */
        organization: createValidator({
          /** Organization ID. */
          id: t.string,
          /** Organization name. */
          name: t.string
        })
      })
    )
  }
);
