/**
 * Interface for PATCH /sequence/:id
 */

export interface UpdateSequenceRequest {
    /** ID of the Sequence to be updated */
    id: string;
    /** A flag indicating if the Sequence is active */
    isActive?: boolean;
    /** Name of the Sequence */
    name?: string;
    /** Organization ID */
    organization: string;
}
