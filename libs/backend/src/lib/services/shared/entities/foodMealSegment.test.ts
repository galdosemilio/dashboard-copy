/**
 * foodMealSegment
 */

import { createValidator, optional } from '@coachcare/backend/tests';
import * as t from 'io-ts';
import { entity, tracedEntity } from '../generic/index.test';
import { foodMealPlanSegment } from './foodMealPlanSegment.test';
import { foodMealServingItem } from './foodMealServingItem.test';
import { foodMealSummary } from './foodMealSummary.test';

export const foodMealSegment = createValidator({
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
  servings: t.array(foodMealServingItem),
  /** A collection of keys associated with a meal. */
  keys: t.array(tracedEntity),
  /** An array of associated meal plans. */
  mealPlans: t.array(foodMealPlanSegment)
});
