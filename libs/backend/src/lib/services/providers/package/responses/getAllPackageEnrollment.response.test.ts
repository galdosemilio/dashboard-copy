/**
 * GET /package/enrollment
 */

import { createTest } from '@coachcare/backend/tests';
import * as t from 'io-ts';
import { packageEnrollmentSegment, pagination } from '../../../shared/index.test';
import { GetAllPackageEnrollmentResponse } from './getAllPackageEnrollment.response';

export const getAllPackageEnrollmentResponse = createTest<GetAllPackageEnrollmentResponse>(
  'GetAllPackageEnrollmentResponse',
  {
    /** An array of enrollments. */
    data: t.array(packageEnrollmentSegment),
    /** Pagination object. */
    pagination: pagination
  }
);
