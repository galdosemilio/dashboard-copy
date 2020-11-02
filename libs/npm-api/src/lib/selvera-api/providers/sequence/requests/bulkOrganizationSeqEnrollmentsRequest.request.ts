/**
 * Interface for POST /sequence/enrollment/bulk/organization and /sequence/enrollment/bulk/organization/inactive
 */

export interface BulkOrganizationSeqEnrollmentsRequest {
    /** Initial Transition execution date */
    executeAt?: string | { local: string } | { utc: string };
    /** Organization ID */
    organization: string;
    /** Sequence ID */
    sequence: string;
    /** Transition ID */
    transition: string;
}
