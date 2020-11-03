/**
 * Interface POST /mfa
 */

export interface CreateUserMFAResponse {
    /** ID of the MFA channel instance */
    id: string;
    /** OTPAuth link for Authenticator apps */
    qrCodeUrl?: string;
}
