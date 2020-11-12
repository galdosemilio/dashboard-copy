/**
 * Interface for PATCH /key/consumed
 */

import { Entity } from '../../common/entities'

export interface UpdateConsumedKeyRequest {
  id: string
  quantity?: number
  meal?: Partial<Entity>
}
