/**
 * GET /food/consumed
 */

import { createTest } from '@coachcare/backend/tests';
import * as t from 'io-ts';
import { pagination } from '../../../shared/index.test';
import { foodConsumedSingle } from '../../food/responses/foodConsumed.single.test';
import { GetAllFoodConsumedResponse } from './getAllFoodConsumed.response';

export const getAllFoodConsumedResponse = createTest<GetAllFoodConsumedResponse>(
  'GetAllFoodConsumedResponse',
  {
    /** Array of consumed meal. */
    data: t.array(foodConsumedSingle),
    /** Pagination object. */
    pagination: pagination
  }
);
