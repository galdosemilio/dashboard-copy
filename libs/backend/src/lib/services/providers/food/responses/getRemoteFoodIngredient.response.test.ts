/**
 * GET /food/ingredient/:id
 */

import { createTest, optional } from '@coachcare/backend/tests';
import * as t from 'io-ts';
import { entity, ingredientType } from '../../../shared/index.test';
import { foodServingSingle } from '../../food/responses/foodServing.single.test';
import { GetRemoteFoodIngredientResponse } from './getRemoteFoodIngredient.response';

export const getRemoteFoodIngredientResponse = createTest<GetRemoteFoodIngredientResponse>(
  'GetRemoteFoodIngredientResponse',
  {
    /** ID of the ingredient. If the ingredient is not local, this is the remote ID. */
    id: t.string,
    /** Name of the ingredient. */
    name: t.string,
    /** Type of the ingredient. */
    type: optional(ingredientType),
    /**
     * A flag indicating if it's a locally sourced ingredient. If the flag is `false`, the ID is a remote ID.
     * Otherwise, the ID is the local ingredient ID.
     */
    isLocal: t.boolean,
    /** Account information. Only included for local ingredients that are private. */
    account: optional(entity),
    /** Serving collection. */
    servings: t.array(foodServingSingle)
  }
);
