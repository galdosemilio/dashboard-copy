/**
 * POST /organization/:id/preference/asset
 */

import { SignedUrl } from '../../../shared';

export interface CreateAssetsOrganizationPreferenceResponse {
  /** Signed URLs. */
  urls: Array<SignedUrl>;
}
