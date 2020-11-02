/**
 * Interface for POST /message/preference/organization
 */

export interface CreateOrgPreferenceRequest {
    /** A flag indicating if the message service is active for the Organization */
    isActive: boolean;
    /** Organization ID */
    organization: string;
    useAutoThreadParticipation?: boolean;
}
