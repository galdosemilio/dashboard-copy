/**
 * POST /organization/:id/preference/asset
 */

import { createTest } from '@coachcare/backend/tests';
import * as t from 'io-ts';
import { signedUrl } from '../../../shared/index.test';
import { CreateAssetsOrganizationPreferenceResponse } from './createAssetsOrganizationPreference.response';

export const createAssetsOrganizationPreferenceResponse = createTest<
  CreateAssetsOrganizationPreferenceResponse
>('CreateAssetsOrganizationPreferenceResponse', {
  /** Signed URLs. */
  urls: t.array(signedUrl)
});
