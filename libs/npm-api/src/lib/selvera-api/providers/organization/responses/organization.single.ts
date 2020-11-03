/**
 * GET /organization/:id
 */

import { AddressItem, ContactItem, OrgPreference } from '../../common/entities'

export interface OrganizationSingle {
  /** Organization ID. */
  id: string
  /** Organization name. */
  name: string
  /** Organization shortcode. */
  shortcode: string
  /** Creation timestamp. */
  createdAt?: string
  /** A path of hierarchy IDs. */
  hierarchyPath: Array<string>
  /** Organization active flag. */
  isActive: boolean
  /** Contact information. */
  contact: ContactItem
  /** Address data. */
  address?: Partial<AddressItem>
  /** Basic organization preferences, including the hierarchy chain. */
  preferences: Array<OrgPreference>
  openAssociation?: {
    /** If true, any manager may associate a client to this organization. */
    client: boolean
    /** If true, any manager may associate a provider to this organization. */
    provider: boolean
  }
  /** Automatic organization disassociation flags */
  automaticDisassociation?: {
    /** Indicates whether client accounts should be automatically disassociated on a different association creation. */
    client: boolean
  }
}
