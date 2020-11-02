/**
 * Interface for GET /sequence/trigger/:id
 */

export interface GetSequenceTriggerRequest {
    /** Trigger ID */
    id: string;
    /** Organization ID */
    organization: string;
}
