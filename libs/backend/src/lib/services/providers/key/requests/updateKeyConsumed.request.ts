/**
 * PATCH /key/consumed/:id
 */

import { Entity } from '../../../shared';

export interface UpdateKeyConsumedRequest {
  /** The id of the consumed key record. */
  id: string;
  /** The number of units of meal's key consumed. */
  quantity?: number;
  /** Object with id of the key related meal that was consumed. */
  consumedMeal?: Partial<Entity>;
}
