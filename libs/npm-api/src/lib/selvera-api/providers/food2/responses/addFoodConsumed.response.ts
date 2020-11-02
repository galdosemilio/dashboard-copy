/**
 * POST /food/consumed/new
 */

import { Entity } from '../../common/entities'

export interface AddFoodConsumedResponse {
  /** The newly created consumed meal record. */
  consumed: Entity
  /** The newly created meal record. */
  meal: Entity
}
