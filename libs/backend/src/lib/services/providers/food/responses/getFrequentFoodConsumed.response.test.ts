/**
 * GET /food/consumed/frequent
 */

import { createTest } from '@coachcare/backend/tests';
import * as t from 'io-ts';
import { foodConsumedFrequently, pagination } from '../../../shared/index.test';
import { GetFrequentFoodConsumedResponse } from './getFrequentFoodConsumed.response';

export const getFrequentFoodConsumedResponse = createTest<GetFrequentFoodConsumedResponse>(
  'GetFrequentFoodConsumedResponse',
  {
    /** Array of consumed meal. */
    data: t.array(foodConsumedFrequently),
    /** Pagination object. */
    pagination: pagination
  }
);
