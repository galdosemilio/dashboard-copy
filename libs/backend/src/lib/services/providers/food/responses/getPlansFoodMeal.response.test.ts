/**
 * GET /food/meal-plan
 */

import { createTest } from '@coachcare/backend/tests';
import * as t from 'io-ts';
import { basicMealPlan, pagination } from '../../../shared/index.test';
import { GetPlansFoodMealResponse } from './getPlansFoodMeal.response';

export const getPlansFoodMealResponse = createTest<GetPlansFoodMealResponse>(
  'GetPlansFoodMealResponse',
  {
    /** Array of meal plans. */
    data: t.array(basicMealPlan),
    /** Pagination object. */
    pagination: pagination
  }
);
