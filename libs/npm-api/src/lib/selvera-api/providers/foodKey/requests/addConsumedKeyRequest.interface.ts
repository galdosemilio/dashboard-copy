/**
 * Interface for POST /key/consumed
 */

import { Entity } from '../../common/entities'

export interface AddConsumedKeyRequest {
  keyOrganization: string
  quantity: number
  consumedAt: string
  meal?: Partial<Entity>
}
