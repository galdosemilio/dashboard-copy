/**
 * GET /package/enrollment/:id
 */

import { EnrollmentDates, Entity, PackageRef } from '../../../shared';

export interface PackageEnrollmentSingle {
  /** The account associated with this enrollment. */
  account: Entity;
  /** The package associated with this enrollment. */
  package: PackageRef;
  /** The organization associated with this package, which is associated with this enrollment. */
  organization: Entity;
  /** If this enrollment is active. */
  isActive: boolean;
  /** Enrollment dates. */
  enroll: EnrollmentDates;
}
