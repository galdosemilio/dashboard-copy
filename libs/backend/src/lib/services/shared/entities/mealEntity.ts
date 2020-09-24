/**
 * MealEntity
 */

import { Entity } from '../generic';

export interface MealEntity {
  /** Meal ID. */
  id: string;
  /** Account associated with the meal. */
  account?: Entity;
}
