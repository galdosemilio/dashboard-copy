/**
 * Interface for PATCH /communication/preference/:id
 */

export interface UpdateCommunicationPreferenceRequest {
    /** Preference entry ID */
    id: string;
    /** A flag indicating if the Preference is active */
    isActive?: boolean;
    /** Videoconferencing feature settings */
    videoConferencing?: {
        /** A flag indicating if videoconferencing is enabled */
        isEnabled: boolean;
    };
}
