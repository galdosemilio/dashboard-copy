/**
 * POST /food/ingredient/local
 */

import { createTest, createValidator } from '@coachcare/backend/tests';
import * as t from 'io-ts';
import { CreateLocalFoodIngredientResponse } from './createLocalFoodIngredient.response';

export const createLocalFoodIngredientResponse = createTest<CreateLocalFoodIngredientResponse>(
  'CreateLocalFoodIngredientResponse',
  {
    servings: createValidator({
      /**
       * Indicates whether the serving is a default serving for an ingredient.
       * Only one serving can be a default serving for an ingredient.
       */
      isDefault: t.boolean
    }),
    /** ID of the ingredient. */
    id: t.string
  }
);
