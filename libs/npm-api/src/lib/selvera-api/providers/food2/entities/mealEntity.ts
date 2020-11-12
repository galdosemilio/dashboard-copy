/**
 * MealEntity
 */

import { Entity } from '../../common/entities'

export interface MealEntity {
  /** Meal ID. */
  id: string
  /** Account associated with the meal. */
  account?: Entity
}
