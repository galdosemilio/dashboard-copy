/**
 * GET /pain-tracking/type
 */

import { createTest, createValidator } from '@coachcare/backend/tests';
import * as t from 'io-ts';
import { painTypeId } from '../../../shared/index.test';
import { GetTypesPainTrackingResponse } from './getTypesPainTracking.response';

export const getTypesPainTrackingResponse = createTest<GetTypesPainTrackingResponse>(
  'GetTypesPainTrackingResponse',
  {
    /** Pain types list. */
    data: t.array(
      createValidator({
        /** Pain type ID. */
        id: painTypeId,
        /** Pain type description. */
        description: t.string
      })
    )
  }
);
