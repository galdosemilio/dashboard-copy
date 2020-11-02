/**
 * Interface for POST /communication/preference
 */

export interface CreateCommunicationPreferenceRequest {
    /** A flag indicating if the Preference is active */
    isActive?: boolean;
    /** Organization ID */
    organization: string;
    /** Videoconferencing feature settings */
    videoConferencing: {
        /** A flag indicating if videoconferencing is enabled */
        isEnabled: boolean;
    };
}
