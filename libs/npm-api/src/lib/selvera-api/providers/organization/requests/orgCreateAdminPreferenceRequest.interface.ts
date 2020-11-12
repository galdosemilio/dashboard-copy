/**
 * POST /organization/:id/preference/admin
 */

import { AppIds, OrganizationMala } from '../entities'

export interface OrgCreateAdminPreferenceRequest {
  /** The id of the organization. */
  id: string
  /** Reset password baseUrl */
  resetPasswordBaseUrl?: string
  /** App IDs */
  appIds?: AppIds
  mala?: OrganizationMala
}
