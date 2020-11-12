import { ApiService } from '../../services/api.service'
import {
  ResetPasswordRequest,
  UpdatePasswordRequest,
  UpdatePasswordRequestMFA
} from './requests'
import { UpdatePasswordResponse } from './responses'

/**
 * Password reset request and handling
 */
class Access {
  /**
   * Init Api Service
   */
  public constructor(private readonly apiService: ApiService) {}

  /**
   * Request password reset email.
   * On success, an email will be sent to this user's account with a reset password link and instructions.
   * @param data must implement ResetPasswordRequest
   * @returns void
   */
  public resetPassword(data: ResetPasswordRequest): Promise<void> {
    return this.apiService.request({
      endpoint: '/account/password-reset',
      method: 'POST',
      data: data,
      version: '2.0'
    })
  }

  /**
   * Update the user's password.
   * Using the activation code sent in the reset password email
   * @param data must implement UpdatePasswordRequest
   * @returns void
   */
  public updatePassword(
    data: UpdatePasswordRequest
  ): Promise<UpdatePasswordResponse | void> {
    return this.apiService.request({
      endpoint: '/account/password-reset/update',
      method: 'POST',
      data: data,
      version: '2.0'
    })
  }

  /**
   * Update the user's password.
   * Using the activation code sent in the reset password email and MFA code
   * @param data must implement UpdatePasswordRequestMFA
   * @returns void
   */
  public updatePasswordMFA(data: UpdatePasswordRequestMFA): Promise<void> {
    return this.apiService.request({
      endpoint: '/account/password-reset/update/mfa',
      method: 'POST',
      data: data,
      version: '2.0'
    })
  }
}

export { Access }
