/**
 * GET /hydration/summary
 */

import { createTest, createValidator } from '@coachcare/backend/tests';
import * as t from 'io-ts';
import { GetSummaryHydrationResponse } from './getSummaryHydration.response';

export const getSummaryHydrationResponse = createTest<GetSummaryHydrationResponse>(
  'GetSummaryHydrationResponse',
  {
    /** An object of hydration arrays. */
    hydration: t.array(
      createValidator({
        /** The date that starts the week or month. */
        date: t.string,
        /** The total number of mL drank over this period. */
        total: t.number,
        /** The maximum number of mL drank on any one day of this period. */
        max: t.number,
        /** The average number of mL drank on any day within this period. */
        average: t.number
      })
    )
  }
);
