/**
 * GET /supplement/organization
 */

import { createTest, createValidator, optional } from '@coachcare/backend/tests';
import * as t from 'io-ts';
import { entity, pagination, supplementItem } from '../../../shared/index.test';
import { GetAllSupplementOrganizationResponse } from './getAllSupplementOrganization.response';

export const getAllSupplementOrganizationResponse = createTest<
  GetAllSupplementOrganizationResponse
>('GetAllSupplementOrganizationResponse', {
  /** Collection of supplements for specified organizations. */
  data: t.array(
    createValidator({
      /** ID of an organization-supplement association. */
      id: t.string,
      /** Organization object. */
      organization: entity,
      /** Core supplement data. */
      supplement: supplementItem,
      /** Dosage for the supplement for given organization. */
      dosage: optional(t.string)
    })
  ),
  /** Pagination object. */
  pagination: pagination
});
