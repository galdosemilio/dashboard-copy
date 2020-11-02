/**
 * PATCH /organization/:id/preference/admin
 */
import { AppIds, OrganizationMala } from '../entities'

export interface UpdateAdminPreferenceRequest {
  /** The id of the organization. */
  id: string
  /** Reset password baseUrl */
  resetPasswordBaseUrl?: string
  mala?: OrganizationMala
  appIds?: Partial<AppIds>
}
