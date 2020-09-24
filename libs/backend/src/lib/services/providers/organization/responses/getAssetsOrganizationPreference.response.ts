/**
 * GET /organization/:id/preference/assets
 */

import { AppIds, OrgAssets } from '../../../shared';

export interface GetAssetsOrganizationPreferenceResponse {
  /** ID of an organization the assets belongs to. */
  id: string;
  /** Display name of the organization. */
  displayName?: string;
  /** Organization assets. */
  assets: OrgAssets;
  /** App ID mapping. */
  appIds: Partial<AppIds>;
  /** MALA settings. */
  mala?: any;
}
