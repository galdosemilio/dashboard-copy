/**
 * POST /organization/:id/preference/asset
 */

import { SignedUrl } from '../entities'

export interface CreateAssetsOrganizationPreferenceResponse {
  /** Signed URLs. */
  urls: Array<SignedUrl>
}
