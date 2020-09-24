/**
 * GET /package/enrollment/:id
 */

import { createTestFromValidator, createValidator } from '@coachcare/backend/tests';
import * as t from 'io-ts';
import { enrollmentDates, entity, packageRef } from '../../../shared/index.test';
import { PackageEnrollmentSingle } from './packageEnrollment.single';

export const packageEnrollmentSingle = createValidator({
  /** The account associated with this enrollment. */
  account: entity,
  /** The package associated with this enrollment. */
  package: packageRef,
  /** The organization associated with this package, which is associated with this enrollment. */
  organization: entity,
  /** If this enrollment is active. */
  isActive: t.boolean,
  /** Enrollment dates. */
  enroll: enrollmentDates
});

export const packageEnrollmentResponse = createTestFromValidator<PackageEnrollmentSingle>(
  'PackageEnrollmentSingle',
  packageEnrollmentSingle
);
