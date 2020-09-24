/**
 * GET /supplement/account/organization/
 */

import { createTest, optional } from '@coachcare/backend/tests';
import * as t from 'io-ts';
import { GetAllSupplementAccountOrganizationResponse } from './getAllSupplementAccountOrganization.response';

export const getAllSupplementAccountOrganizationResponse = createTest<
  GetAllSupplementAccountOrganizationResponse
>('GetAllSupplementAccountOrganizationResponse', {
  /** Association ID. */
  id: t.string,
  /** ID of the supplement-organization association. */
  supplementOrganizationId: t.string,
  /** ID of the client account. */
  accountId: t.string,
  /** Custom, client-specific dosage. */
  dosage: optional(t.number)
});
