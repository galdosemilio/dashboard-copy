import { Injectable } from '@angular/core';
import { ApiService } from '../../api.service';
import {
  ResetAccountPasswordRequest,
  UpdateAccountPasswordRequest,
  UpdateAccountPasswordRequestMFA
} from './requests';
import { UpdateAccountPasswordResponse } from './responses';

@Injectable({
  providedIn: 'root'
})
export class AccountPassword {
  public constructor(private readonly apiService: ApiService) {}

  /**
   * Request password reset email.
   * On success, an email will be sent to this user's account with a reset password link and instructions.
   * Permissions: Public
   *
   * @param request must implement ResetAccountPasswordRequest
   * @return Promise<void>
   */
  public reset(request: ResetAccountPasswordRequest): Promise<void> {
    return this.apiService.request({
      endpoint: `/account/password-reset`,
      method: 'POST',
      version: '2.0',
      data: request
    });
  }

  /**
   * Update the user's password, using the activation code sent in the reset password email.
   * Permissions: Public
   *
   * @param request must implement UpdateAccountPasswordRequest
   * @return Promise<void>
   */
  public update(
    request: UpdateAccountPasswordRequest
  ): Promise<UpdateAccountPasswordResponse | void> {
    return this.apiService.request({
      endpoint: `/account/password-reset/update`,
      method: 'POST',
      version: '2.0',
      data: request
    });
  }

  /**
   * Update the user's password.
   * Using the activation code sent in the reset password email and MFA code
   * @param data must implement UpdatePasswordRequestMFA
   * @returns void
   */
  public updatePasswordMFA(data: UpdateAccountPasswordRequestMFA): Promise<void> {
    return this.apiService.request({
      endpoint: '/account/password-reset/update/mfa',
      method: 'POST',
      data: data,
      version: '2.0'
    });
  }
}
