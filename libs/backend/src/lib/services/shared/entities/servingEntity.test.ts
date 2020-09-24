/**
 * servingEntity
 */

import { createValidator } from '@coachcare/backend/tests';
import * as t from 'io-ts';
import { ingredientEntity } from './ingredientEntity.test';

export const servingEntity = createValidator({
  /** Serving ID. */
  id: t.string,
  /** Ingredient associated with the serving. */
  ingredient: ingredientEntity
});
