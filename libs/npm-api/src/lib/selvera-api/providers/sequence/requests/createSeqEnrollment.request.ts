/**
 * Interface for POST /sequence/enrollment
 */

export interface CreateSeqEnrollmentRequest {
    /** Account ID */
    account: string;
    /** Creator account ID */
    createdBy: string;
    /** Initial Transition execution date */
    executeAt?: string;
    /** Organization ID */
    organization: string;
    /** Sequence ID */
    sequence: string;
    /** Initial Transition ID */
    transition: string;
}
