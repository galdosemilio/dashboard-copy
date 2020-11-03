/**
 * Account Identifier
 */

import { Entity } from '../../../common/entities'
import { OrganizationEntity } from '../../../organization/entities'

export interface Identifier {
  id: string
  account: Entity
  organization: OrganizationEntity
  name: string
  value: string
  isActive: boolean
}
