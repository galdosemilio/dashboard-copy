/**
 * IngredientEntity
 */

import { Entity } from '../generic';

export interface IngredientEntity {
  /** Ingredient ID. */
  id: string;
  /** Account associated with the ingredient. */
  account?: Entity;
}
