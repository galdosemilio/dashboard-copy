/**
 * Interface for GET /warehouse/enrollment/accounts-by-organization
 */

export interface EnrollmentSnapshotRequest {
    organization: string;
    date: string;
    includeInactiveEnrollments?: boolean;
    includeInactivePackages?: boolean;
}
