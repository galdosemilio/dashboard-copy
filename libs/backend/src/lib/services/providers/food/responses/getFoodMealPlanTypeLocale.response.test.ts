/**
 * GET /food/meal-plan/type/:id/locale/:locale
 */

import { createTest, optional } from '@coachcare/backend/tests';
import * as t from 'io-ts';
import { GetFoodMealPlanTypeLocaleResponse } from './getFoodMealPlanTypeLocale.response';

export const getFoodMealPlanTypeLocaleResponse = createTest<GetFoodMealPlanTypeLocaleResponse>(
  'GetFoodMealPlanTypeLocaleResponse',
  {
    /** Localized description of a meal-plan type. */
    description: optional(t.string)
  }
);
