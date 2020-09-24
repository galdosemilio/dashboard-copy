/**
 * GET /food/meal/:id
 */

import { createTestFromValidator, createValidator, optional } from '@coachcare/backend/tests';
import * as t from 'io-ts';
import {
  entity,
  foodMealPlanSegment,
  foodMealServingItemSummarized,
  foodMealSummary,
  tracedEntity
} from '../../../shared/index.test';
import { FoodMealSingle } from './foodMeal.single';

export const foodMealSingle = createValidator({
  /** The id of the meal record. */
  id: t.string,
  /** The name of the meal record. */
  name: t.string,
  /** The timestamp of when the meal was created. */
  createdAt: t.string,
  /** The image url of the meal if it exists. */
  imageUrl: t.string,
  /** Flag showing if meal is public (does not have associated account) */
  isPublic: t.boolean,
  /** Account associated with this meal. */
  account: optional(entity),
  /** Aggregation of nutrition data for a meal. */
  summary: foodMealSummary,
  /** List of servings for the meal. */
  servings: t.array(foodMealServingItemSummarized),
  /** A collection of keys associated with a meal. */
  keys: t.array(tracedEntity),
  /** An array of associated meal plans. */
  mealPlans: t.array(foodMealPlanSegment)
});

export const foodMealResponse = createTestFromValidator<FoodMealSingle>(
  'FoodMealSingle',
  foodMealSingle
);
