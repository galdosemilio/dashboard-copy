/**
 * Interface for PATCH /sequence/state/:id
 */

export interface UpdateSequenceStateRequest {
    /** State ID */
    id: string;
    /** State name */
    name?: string;
}
