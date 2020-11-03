import { TypelessTriggerEntity } from '../entities';

/**
 * Interface for PUT /sequence/trigger/:id
 */

export interface UpdateSequenceTriggerRequest {
    /** Trigger ID */
    id: string;
    /** Organization ID */
    organization: string;
    /** Trigger payload */
    payload: TypelessTriggerEntity;
}
