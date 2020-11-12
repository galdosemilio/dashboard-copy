/**
 * Organization
 */

import { OrgAddress } from './address.interface'
import { Color } from './color.interface'
import { OrgContact } from './contact.interface'

export interface OrganizationEntity {
  id: string
  name: string
  shortcode: string
  hierarchyPath: Array<string>
}

export interface OrganizationWithAddress extends OrganizationEntity {
  address: OrgAddress
  contact?: OrgContact
}

export interface OrganizationDetailed extends OrganizationEntity {
  address?: OrgAddress
  contact: OrgContact
  createdAt?: string
  isActive: boolean
  openAssociation: {
    client: boolean
    provider: boolean
  }
}

export interface AdminOrganization extends OrganizationEntity {
  isActive: boolean
  createdAt: string
}

export type OrganizationWithoutShortcode = Pick<
  OrganizationEntity,
  'id' | 'name' | 'hierarchyPath'
>

export interface OrgAssets {
  logoUrl?: string
  iconUrl?: string
  splashUrl?: string
  faviconUrl?: string
  color: Partial<Color>
}
