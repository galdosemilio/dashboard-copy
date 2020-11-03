/**
 * Interface for GET /sequence/transition/pending
 */

export interface GetSeqTransitionPendingRequest {
    /** Account ID */
    account: string;
    /** Page size. 'all' is not supported this time; the number has to be from 1 to 100 */
    limit?: number;
    /** Page offset */
    offset?: number;
    /** Organization ID */
    organization: string;
    /** Sequence ID */
    sequence: string;
}
