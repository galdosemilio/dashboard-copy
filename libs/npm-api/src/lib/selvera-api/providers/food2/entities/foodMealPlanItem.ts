/**
 * FoodMealPlanItem
 */

import { DescribedEntity } from '../../content/entities'

export interface FoodMealPlanItem {
  /** Meal plan item type. */
  type: DescribedEntity
  /** A free-form object containing the recipe. */
  recipe?: any
  /** Day of week for which this meal appears in the meal plan. Will be in the range 0 - 6, where 0 - Sunday and 6 - Saturday. */
  dayOfWeek: number
}
