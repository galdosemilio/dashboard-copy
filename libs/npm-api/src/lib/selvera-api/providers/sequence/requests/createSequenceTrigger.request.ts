import { TriggerEntity } from '../entities';

/**
 * Interface for POST /sequence/trigger
 */

export interface CreateSequenceTriggerRequest {
    /** Organization ID */
    organization: string;
    /** Transition ID */
    transition: string;
    /** Trigger Entity */
    trigger: TriggerEntity;
}
