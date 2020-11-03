import { TypelessTriggerEntity } from '../entities';

/**
 * Interface for PUT /sequence/trigger/:id/locale/:locale
 */

export interface CreateSequenceTriggerLocaleRequest {
    /** Trigger ID */
    id: string;
    /** Locale identifier */
    locale: string;
    /** Organization ID */
    organization: string;
    /** Trigger Entity */
    payload: TypelessTriggerEntity;
}
