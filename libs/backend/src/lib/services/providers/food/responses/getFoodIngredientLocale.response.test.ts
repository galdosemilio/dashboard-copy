/**
 * GET /food/ingredient/local/:id/locale/:locale
 */

import { createTest, optional } from '@coachcare/backend/tests';
import * as t from 'io-ts';
import { GetFoodIngredientLocaleResponse } from './getFoodIngredientLocale.response';

export const getFoodIngredientLocaleResponse = createTest<GetFoodIngredientLocaleResponse>(
  'GetFoodIngredientLocaleResponse',
  {
    /** Translated name of the ingredient. */
    name: optional(t.string)
  }
);
