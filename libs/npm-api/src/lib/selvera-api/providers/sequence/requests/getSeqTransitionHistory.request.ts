/**
 * Interface for GET /sequence/transition/history
 */

export interface GetSeqTransitionHistoryRequest {
    /** Account ID */
    account: string;
    /** Page size */
    limit?: number | 'all';
    /** Page offset */
    offset?: number;
    /** Organization ID */
    organization: string;
    /** Sequence ID */
    sequence: string;
}
