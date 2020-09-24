/**
 * GET /food/meal-plan/:id/locale/:locale
 */

import { createTest, optional } from '@coachcare/backend/tests';
import * as t from 'io-ts';
import { GetFoodMealPlanLocaleResponse } from './getFoodMealPlanLocale.response';

export const getFoodMealPlanLocaleResponse = createTest<GetFoodMealPlanLocaleResponse>(
  'GetFoodMealPlanLocaleResponse',
  {
    /** Localized description of a meal-plan. */
    description: optional(t.string)
  }
);
