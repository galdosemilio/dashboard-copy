/**
 * GET /package/organization
 */

import { createTest } from '@coachcare/backend/tests';
import * as t from 'io-ts';
import { packageAssociation } from '../../../shared/index.test';
import { GetAllPackageOrganizationResponse } from './getAllPackageOrganization.response';

export const getAllPackageOrganizationResponse = createTest<GetAllPackageOrganizationResponse>(
  'GetAllPackageOrganizationResponse',
  {
    /** Collection of packages for specified organizations. */
    data: t.array(packageAssociation)
  }
);
