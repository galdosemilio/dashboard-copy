/**
 * Interface for POST /sequence/enrollment/bulk
 */

export interface CreateBulkSeqEnrollmentsRequest {
    /** Account IDs */
    accounts: string[];
    /** Creator account ID */
    createdBy: string;
    /** Initial Transition execution date */
    executeAt?: string | { local: string } | { utc: string };
    /** Organization ID */
    organization: string;
    /** Sequence ID */
    sequence: string;
    /** Transition ID */
    transition: string;
}
