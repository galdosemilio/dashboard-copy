/**
 * POST /key/consumed
 */

import { Entity } from '../../../shared';

export interface CreateKeyConsumedRequest {
  /** The id of the association of meal's key consumed and organization. */
  keyOrganization: string;
  /** The number of units of meal's key consumed. */
  quantity: number;
  /** Date and time the key was consumed, in ISO8601 format. */
  consumedAt: string;
  /** Object with id of the key related meal that was consumed. */
  consumedMeal?: Partial<Entity>;
}
