/**
 * Interface for POST /mfa
 */

export interface CreateUserMFARequest {
    /** Organization associated with the MFA channel instance */
    organization: string;
    /** ID of the MFA channel that's being created */
    channel: string;
}
