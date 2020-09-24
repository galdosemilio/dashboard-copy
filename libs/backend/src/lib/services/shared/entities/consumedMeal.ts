/**
 * ConsumedMeal
 */

import { NamedEntity } from '../generic';

export interface ConsumedMeal {
  /** The id of the consumed meal entry. */
  id: string;
  /** The date when the meal was consumed. */
  consumedAt: string;
  /** The actual consumed meal. */
  meal: NamedEntity;
}
