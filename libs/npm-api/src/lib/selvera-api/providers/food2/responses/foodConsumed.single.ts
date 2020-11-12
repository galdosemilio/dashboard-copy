/**
 * GET /food/consumed/:id
 */

import { Entity, NamedEntity } from '../../common/entities'
import { FoodConsumedSummary, FoodMealItem } from '../entities'

export interface FoodConsumedSingle {
  /** The id of the consumed record. */
  id: string
  /** The account that created this consumed record. */
  account: Entity
  /** The timestamp this meal was consumed. */
  consumedAt: string
  /** The timestamp of when the consumed record was created. */
  createdAt: string
  /** The type of the consumed meal. */
  type: NamedEntity
  /** The number of servings of this meal that were consumed. */
  serving: number
  /** The note of the consumed meal. */
  note?: string
  /** Shows if user has favorited this meal. */
  isFavorite: boolean
  /** The meal that was consumed. */
  meal: FoodMealItem
  /** The summary of nutrients of consumed meal. */
  summary: Partial<FoodConsumedSummary>
}
