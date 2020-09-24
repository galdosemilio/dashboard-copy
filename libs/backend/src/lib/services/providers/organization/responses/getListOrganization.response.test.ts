/**
 * GET /access/organization
 */

import { createTest } from '@coachcare/backend/tests';
import * as t from 'io-ts';
import { orgListSegment, pagination } from '../../../shared/index.test';
import { GetListOrganizationResponse } from './getListOrganization.response';

export const getListOrganizationResponse = createTest<GetListOrganizationResponse>(
  'GetListOrganizationResponse',
  {
    /** Result collection. */
    data: t.array(orgListSegment),
    /** Pagination object. */
    pagination: pagination
  }
);
