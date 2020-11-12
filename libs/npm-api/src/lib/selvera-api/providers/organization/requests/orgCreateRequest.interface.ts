/**
 * Interface for POST /organization
 */

import { OrgAddress, OrgContact } from '../entities'

export interface OrgCreateRequest {
  name: string
  shortcode: string
  parentOrganizationId: string
  contact: OrgContact
  address?: OrgAddress
  isActive?: boolean
  welcomeEmailAddress?: string
  passwordResetEmailAddress?: string
  openAssociationAddProvider?: boolean
  openAssociationAddClient?: boolean
  newsletter?: boolean
}
