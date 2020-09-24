/**
 * PATCH /package/enrollment/:id
 */

import { EnrollmentDates } from '../../../shared';

export interface UpdatePackageEnrollmentRequest {
  /** The enrollment ID. */
  id: string;
  /** If this enrollment is active. */
  isActive?: boolean;
  /** Enrollment dates. */
  enroll?: EnrollmentDates;
}
