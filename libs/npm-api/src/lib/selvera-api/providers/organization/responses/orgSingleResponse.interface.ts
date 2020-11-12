/**
 * Interface for OrgSingleResponse
 */

import { OrganizationDetailed, OrganizationPreferences } from '../entities'

export interface OrgSingleResponse extends OrganizationDetailed {
  preferences: Array<OrganizationPreferences>
  /** Automatic organization disassociation flags */
  automaticDisassociation?: {
    /** Indicates whether client accounts should be automatically disassociated on a different association creation. */
    client: boolean
  }
}
