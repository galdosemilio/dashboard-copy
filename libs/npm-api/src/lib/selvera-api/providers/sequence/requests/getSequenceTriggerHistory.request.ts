/**
 * Interface for GET /sequence/trigger/history
 */

export interface GetSequenceTriggerHistoryRequest {
    /** Account ID */
    account: string;
    /** Page size */
    limit?: number;
    /** Page offset */
    offset?: number;
    /** Organization ID */
    organization: string;
    /** Date range filter */
    range?: {
        /** Start cutoff timestamp */
        start?: string;
        /** End cutoff timestamp */
        end: string;
    };
    /** Sequence ID */
    sequence: string;
}
