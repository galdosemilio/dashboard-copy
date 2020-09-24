/**
 * ingredientEntity
 */

import { createValidator, optional } from '@coachcare/backend/tests';
import * as t from 'io-ts';
import { entity } from '../generic/index.test';

export const ingredientEntity = createValidator({
  /** Ingredient ID. */
  id: t.string,
  /** Account associated with the ingredient. */
  account: optional(entity)
});
