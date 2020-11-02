/**
 * Interface for POST /mfa/:id/verify
 */

export interface VerifyUserMFARequest {
    /** ID of the MFA instance that's being verified */
    id: string;
    /** Single-use verification code */
    code: string;
}
