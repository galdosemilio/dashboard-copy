/**
 * Interface for POST /sequence/state
 */

export interface CreateSequenceStateRequest {
    /** The ID of the user creating the State */
    createdBy: string;
    /** Name of the State */
    name: string;
    /** Sequence ID */
    sequence: string;
    /** Organization ID */
    organization: string;
}
