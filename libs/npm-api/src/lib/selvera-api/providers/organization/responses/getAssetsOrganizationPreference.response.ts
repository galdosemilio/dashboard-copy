/**
 * GET /organization/:id/preference/assets
 */

import { OrganizationAssets } from '../entities'

export interface GetAssetsOrganizationPreferenceResponse {
  /** ID of an organization the assets belongs to. */
  id: string
  /** Display name of the organization. */
  displayName?: string
  /** Organization assets. */
  assets: OrganizationAssets
  /** MALA settings. */
  mala?: any
}
