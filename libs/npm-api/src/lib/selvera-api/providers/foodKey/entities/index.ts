/**
 * Generic relation interfaces
 */

import { AccSingleResponse } from '../../account/responses'
import { Entity } from '../../common/entities'
import { NamedEntity } from '../../common/entities/namedEntity'
import { OrganizationEntity } from '../../organization/entities'

export interface KeyDataEntity extends NamedEntity {
  description: string
}

export interface KeyDataEntryActive extends KeyDataEntity {
  isActive: boolean
}

export interface KeyDataEntry extends KeyDataEntryActive {
  createdAt: string
}

export interface AccountKeyEntryEntity extends Entity {
  targetQuantity: number
  account: AccSingleResponse
  organization: OrganizationEntity
  key: KeyDataEntity
}
