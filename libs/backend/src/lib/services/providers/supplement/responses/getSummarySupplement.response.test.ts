/**
 * GET /supplement/summary
 */

import { createTest, createValidator } from '@coachcare/backend/tests';
import * as t from 'io-ts';
import { supplementConsumed } from '../../../shared/index.test';
import { GetSummarySupplementResponse } from './getSummarySupplement.response';

export const getSummarySupplementResponse = createTest<GetSummarySupplementResponse>(
  'GetSummarySupplementResponse',
  {
    /** A summary collection. */
    summary: t.array(
      createValidator({
        /** The date that starts the week or month. */
        date: t.string,
        /** Supplement consumption. */
        consumption: t.array(
          createValidator({
            /** Supplement consumed. */
            supplement: supplementConsumed,
            /** Quantity consumed. */
            quantity: t.number
          })
        )
      })
    )
  }
);
