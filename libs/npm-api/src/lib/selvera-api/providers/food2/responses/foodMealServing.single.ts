/**
 * GET /food/meal/:meal/serving/:serving
 */

import { MealEntity, ServingEntity } from '../entities'

export interface FoodMealServingSingle {
  /** Associated meal. */
  meal: MealEntity
  /** The id of the serving from association. */
  serving: ServingEntity
  /** Quantity of serving associated with the meal. */
  quantity: number
}
