/**
 * Interface for PATCH /message/preference/organization/:id
 */

export interface UpdateMessagingOrgPreferenceRequest {
    /** Preference ID */
    id: string;
    /** A flag indicating if the Messaging service is active for the Organization or not */
    isActive?: boolean;
    useAutoThreadParticipation?: boolean;
}
