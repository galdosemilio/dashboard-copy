/**
 * foodMealPlanSegment
 */

import { createValidator } from '@coachcare/backend/tests';
import * as t from 'io-ts';
import { foodMealPlanItem } from './foodMealPlanItem.test';

export const foodMealPlanSegment = createValidator({
  /** ID of the meal plan. */
  id: t.string,
  /** Description of the meal plan. */
  description: t.string,
  /** Meal plan items. */
  items: t.array(foodMealPlanItem)
});
