/**
 * Interface for PATCH /mfa/preference/:id
 */

export interface UpdateOrganizationMFARequest {
    /** ID of the preference instance */
    id: string;
    /** Whether MFA is set up or not */
    isActive: boolean;
}
