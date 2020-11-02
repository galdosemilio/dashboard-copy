/**
 * POST /account/password-reset/update
 */

import { MFAToken } from '../../common/entities'

export interface UpdatePasswordRequest {
  /** Email of user account to request reset for. */
  email: string
  /** The activation code sent to this user. */
  code: string
  /** The new password. */
  password: string
  /** Organization ID. */
  organization?: string
  /** A flag indicating that the user consented to Terms of Service. Passing `false` will cancel the password reset process. */
  consent?: boolean
  /** A flag indicating if we should send password reset request once again when the link is expired. */
  retry?: boolean
}

/**
 * POST /account/password-reset/update/mfa
 */
export type UpdatePasswordRequestMFA = UpdatePasswordRequest & {
  /** MFA token */
  token: MFAToken
}
