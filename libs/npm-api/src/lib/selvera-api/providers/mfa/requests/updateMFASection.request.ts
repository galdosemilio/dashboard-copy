/**
 * Interface for PATCH /mfa/preference/:id/section/:id
 */

export interface UpdateMFASectionRequest {
    /** ID of the involved MFA section instance */
    id: string;
    /** Whether MFA is required or not for the involved section */
    isRequired: boolean;
    /** ID of the preference instance that contains the section */
    preference: string;
}
