/**
 * GET /food/meal
 */

import { createTest } from '@coachcare/backend/tests';
import * as t from 'io-ts';
import { foodMealSegment, pagination } from '../../../shared/index.test';
import { GetAllFoodMealResponse } from './getAllFoodMeal.response';

export const getAllFoodMealResponse = createTest<GetAllFoodMealResponse>('GetAllFoodMealResponse', {
  /** Array of meals. */
  data: t.array(foodMealSegment),
  /** Pagination object. */
  pagination: pagination
});
