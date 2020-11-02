/**
 * Interface for GET /consumed/:id (response)
 */

import { Entity, NamedEntity } from '../../common/entities'
import { OrganizationEntity } from '../../organization/entities'

export interface ConsumedKeyResponse {
  consumedId: string
  account: Entity
  key: NamedEntity
  organization: OrganizationEntity
  quantity: number
  consumedAt: string
  createdAt: string
  meal?: NamedEntity
}
