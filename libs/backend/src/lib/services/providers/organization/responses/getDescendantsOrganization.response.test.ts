/**
 * GET /organization/:id/descendants
 */

import { createTest } from '@coachcare/backend/tests';
import * as t from 'io-ts';
import { orgEntity, pagination } from '../../../shared/index.test';
import { GetDescendantsOrganizationResponse } from './getDescendantsOrganization.response';

export const getDescendantsOrganizationResponse = createTest<GetDescendantsOrganizationResponse>(
  'GetDescendantsOrganizationResponse',
  {
    /** An array of child organizations. */
    data: t.array(orgEntity),
    /** Pagination object. */
    pagination: pagination
  }
);
