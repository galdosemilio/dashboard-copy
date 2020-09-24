/**
 * GET /organization/
 */

import { createTest } from '@coachcare/backend/tests';
import * as t from 'io-ts';
import { orgEntityExtended, pagination } from '../../../shared/index.test';
import { GetAllOrganizationResponse } from './getAllOrganization.response';

export const getAllOrganizationResponse = createTest<GetAllOrganizationResponse>(
  'GetAllOrganizationResponse',
  {
    /** Array of organizations. */
    data: t.array(orgEntityExtended),
    /** Pagination object. */
    pagination: pagination
  }
);
