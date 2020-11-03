/**
 * PATCH /package/enrollment/:id
 */

import { EnrollmentDates } from '../entities';

export interface UpdatePackageEnrollmentRequest {
    /** The enrollment ID. */
    id: string;
    /** If this enrollment is active. */
    isActive?: boolean;
    /** Enrollment dates. */
    enroll?: EnrollmentDates;
}
