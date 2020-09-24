/**
 * foodMealPlanItem
 */

import { createValidator, optional } from '@coachcare/backend/tests';
import * as t from 'io-ts';
import { describedEntity } from '../generic/index.test';

export const foodMealPlanItem = createValidator({
  /** Meal plan item type. */
  type: describedEntity,
  /** A free-form object containing the recipe. */
  recipe: optional(t.any),
  /** Day of week for which this meal appears in the meal plan. Will be in the range 0 - 6, where 0 - Sunday and 6 - Saturday. */
  dayOfWeek: t.number
});
