/**
 * GET /food/meal/:id
 */

import { Entity } from '../../common/entities'
import { TracedEntity } from '../../content/entities'
import {
  FoodMealPlanSegment,
  FoodMealServingItemSummarized,
  FoodMealSummary
} from '../entities'

export interface FoodMealSingle {
  /** The id of the meal record. */
  id: string
  /** The name of the meal record. */
  name: string
  /** The timestamp of when the meal was created. */
  createdAt: string
  /** The image url of the meal if it exists. */
  imageUrl: string
  /** Flag showing if meal is public (does not have associated account) */
  isPublic: boolean
  /** Account associated with this meal. */
  account?: Entity
  /** Aggregation of nutrition data for a meal. */
  summary: Partial<FoodMealSummary>
  /** List of servings for the meal. */
  servings: Array<FoodMealServingItemSummarized>
  /** A collection of keys associated with a meal. */
  keys: Array<TracedEntity>
  /** An array of associated meal plans. */
  mealPlans: Array<FoodMealPlanSegment>
}
