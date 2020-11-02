/**
 * Interface for DELETE /sequence/trigger/:id/locale/:locale
 */

export interface DeleteSequenceTriggerLocaleRequest {
    /** Trigger ID */
    id: string;
    /** Locale identifier */
    locale: string;
    /** Organization ID */
    organization: string;
}
