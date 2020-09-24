/**
 * GET /food/meal/:meal/serving/:serving
 */

import { createTestFromValidator, createValidator } from '@coachcare/backend/tests';
import * as t from 'io-ts';
import { mealEntity, servingEntity } from '../../../shared/index.test';
import { FoodMealServingSingle } from './foodMealServing.single';

export const foodMealServingSingle = createValidator({
  /** Associated meal. */
  meal: mealEntity,
  /** The id of the serving from association. */
  serving: servingEntity,
  /** Quantity of serving associated with the meal. */
  quantity: t.number
});

export const foodMealServingResponse = createTestFromValidator<FoodMealServingSingle>(
  'FoodMealServingSingle',
  foodMealServingSingle
);
