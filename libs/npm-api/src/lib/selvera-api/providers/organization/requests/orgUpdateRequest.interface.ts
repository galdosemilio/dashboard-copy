/**
 * Interface for PUT /organization
 */

import { OrgAddress, OrgContact } from '../entities'

export interface OrgUpdateRequest {
  id: number | string
  name?: string
  shortcode?: string
  parentOrganizationId?: string | null
  isActive?: boolean
  contact?: Partial<OrgContact>
  address?: Partial<OrgAddress>
  welcomeEmailAddress?: string
  passwordResetEmailAddress?: string
  openAssociationAddProvider?: boolean
  openAssociationAddClient?: boolean
  /** Automatic organization disassociation flags */
  automaticDisassociation?: {
    /** Indicates whether client accounts should be automatically disassociated on a different association creation. */
    client: boolean
  }
}
