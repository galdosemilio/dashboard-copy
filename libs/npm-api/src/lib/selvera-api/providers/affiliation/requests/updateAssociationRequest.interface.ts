/**
 * Interface for PATCH /association/:account/:organization
 */

import { AffiliationPermissions } from '../entities'

export interface UpdateAssociationRequest {
  account: string
  organization: string
  permissions?: Partial<AffiliationPermissions>
  isActive?: boolean
}
