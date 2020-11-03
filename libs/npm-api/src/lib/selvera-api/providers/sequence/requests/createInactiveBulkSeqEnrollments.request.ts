/**
 * Interface for POST /sequence/enrollment/bulk/inactive
 */

export interface CreateInactiveBulkSeqEnrollmentsRequest {
    /** Account IDs */
    accounts: string[];
    /** Creator account ID */
    createdBy: string;
    /** Sequence ID */
    sequence: string;
}
