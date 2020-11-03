/**
 * PATCH /organization/:id/preference/admin
 */
import { AppIds, OrganizationMala } from '../entities'

export interface CreateAdminPreferenceRequest {
  id: string
  /** Reset password baseUrl */
  resetPasswordBaseUrl?: string
  /** App IDs */
  appIds?: Partial<AppIds>
  mala?: OrganizationMala
}
