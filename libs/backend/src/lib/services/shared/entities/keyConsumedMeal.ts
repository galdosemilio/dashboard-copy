/**
 * KeyConsumedMeal
 */

import { NamedEntity } from '../generic';

export interface KeyConsumedMeal {
  /** The id of the consumed meal entry. */
  id: string;
  /** The date when the meal was consumed. */
  consumedAt: string;
  /** The actual consumed meal. */
  meal: NamedEntity;
}
