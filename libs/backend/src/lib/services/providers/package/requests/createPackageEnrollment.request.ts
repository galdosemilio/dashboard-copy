/**
 * POST /package/enrollment
 */

import { EnrollmentDates } from '../../../shared';

export interface CreatePackageEnrollmentRequest {
  /** The account associated with this enrollment. Optional for Client requests, otherwise required. */
  account?: string;
  /** The package associated with this enrollment. */
  package: string;
  /** Enrollment dates. */
  enroll: EnrollmentDates;
}
