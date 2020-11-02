/**
 * OrgListSegment
 */

import { AllOrgPermissions } from '../../organization/entities'
import { AddressItem } from './addressItem'
import { OrgEntity } from './orgEntity'

export interface OrgSegment extends OrgEntity {
  address: Partial<AddressItem>
}

export interface OrgListSegment {
  /** Organization object. */
  organization: OrgSegment
  /** The permissions object. It's only included for provider accounts. */
  permissions?: Partial<AllOrgPermissions>
  /** A flag indicating if the entry indicates a direct association with an organization or a cascaded entry. */
  isDirect: boolean
}
