/**
 * FoodMealServingItem
 */

import { FoodMealIngredient } from './foodMealIngredient'

export interface FoodMealServingItem {
  /** Serving ID. */
  id: string
  /** A quantity of serving. */
  quantity: number
  /** A description of a serving. */
  description: string
  /** A measurement description. */
  measurementDescription: string
  /** Unit of a serving. */
  unit: string
  /** Amount of a serving in the specified unit. */
  amount: number
  /** Ingredient of this serving. */
  ingredient: FoodMealIngredient
}
