/**
 * GET /organization/:id/preference/assets
 */

import { createTest, optional } from '@coachcare/backend/tests';
import * as t from 'io-ts';
import { appIds, orgAssets } from '../../../shared/index.test';
import { GetAssetsOrganizationPreferenceResponse } from './getAssetsOrganizationPreference.response';

export const getAssetsOrganizationPreferenceResponse = createTest<
  GetAssetsOrganizationPreferenceResponse
>('GetAssetsOrganizationPreferenceResponse', {
  /** ID of an organization the assets belongs to. */
  id: t.string,
  /** Display name of the organization. */
  displayName: optional(t.string),
  /** Organization assets. */
  assets: orgAssets,
  /** App ID mapping. */
  appIds: appIds,
  /** MALA settings. */
  mala: optional(t.any)
});
