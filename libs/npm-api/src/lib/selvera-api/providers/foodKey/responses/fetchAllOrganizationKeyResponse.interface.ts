/**
 * Interface for GET /key/organization (response)
 */

import { OrganizationEntity } from '../../organization/entities'
import { KeyDataEntryActive } from '../entities'

export interface FetchAllOrganizationKeyResponse {
  id: string
  icon?: string
  organization: OrganizationEntity
  key: KeyDataEntryActive
  isActive: boolean
  targetQuantity: string
}
