/**
 * GET /food
 */

import { createTest } from '@coachcare/backend/tests';
import * as t from 'io-ts';
import { foodItem, pagination } from '../../../shared/index.test';
import { GetAllFoodResponse } from './getAllFood.response';

export const getAllFoodResponse = createTest<GetAllFoodResponse>('GetAllFoodResponse', {
  /** Data collection. */
  data: t.array(foodItem),
  /** Pagination object. */
  pagination: pagination
});
