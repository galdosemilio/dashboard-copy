/**
 * foodMealServingItem
 */

import { createValidator } from '@coachcare/backend/tests';
import * as t from 'io-ts';
import { foodMealIngredient } from './foodMealIngredient.test';

export const foodMealServingItem = createValidator({
  /** Serving ID. */
  id: t.string,
  /** A quantity of serving. */
  quantity: t.number,
  /** A description of a serving. */
  description: t.string,
  /** A measurement description. */
  measurementDescription: t.string,
  /** Unit of a serving. */
  unit: t.string,
  /** Amount of a serving in the specified unit. */
  amount: t.number,
  /** Ingredient of this serving. */
  ingredient: foodMealIngredient
});
