/**
 * Interface for POST /account/password-reset
 */

export interface ResetPasswordRequest {
  email: string
  organization?: string
}
