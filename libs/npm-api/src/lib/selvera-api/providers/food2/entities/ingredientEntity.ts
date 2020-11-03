/**
 * IngredientEntity
 */

import { Entity } from '../../common/entities'

export interface IngredientEntity {
  /** Ingredient ID. */
  id: string
  /** Account associated with the ingredient. */
  account?: Entity
}
