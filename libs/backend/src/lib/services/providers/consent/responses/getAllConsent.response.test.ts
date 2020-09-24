/**
 * GET /consent
 */

import { createTest } from '@coachcare/backend/tests';
import * as t from 'io-ts';
import { consentSegment } from '../../../shared/index.test';
import { GetAllConsentResponse } from './getAllConsent.response';

export const getAllConsentResponse = createTest<GetAllConsentResponse>('GetAllConsentResponse', {
  /** Collection of consents. */
  consents: t.array(consentSegment)
});
