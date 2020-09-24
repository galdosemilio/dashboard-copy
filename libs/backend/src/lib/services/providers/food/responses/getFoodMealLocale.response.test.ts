/**
 * GET /food/meal/:id/locale/:locale
 */

import { createTest, optional } from '@coachcare/backend/tests';
import * as t from 'io-ts';
import { GetFoodMealLocaleResponse } from './getFoodMealLocale.response';

export const getFoodMealLocaleResponse = createTest<GetFoodMealLocaleResponse>(
  'GetFoodMealLocaleResponse',
  {
    /** Localized name of a meal. */
    name: optional(t.string)
  }
);
