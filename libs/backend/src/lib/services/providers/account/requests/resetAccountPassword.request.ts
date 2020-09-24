/**
 * POST /account/password-reset
 */

export interface ResetAccountPasswordRequest {
  /** Email of user account to request reset for. */
  email: string;
  /** Organization ID. */
  organization?: string;
}
