import { Injectable } from '@angular/core'
import { ApiService } from '../../services/api.service'
import { Entity } from '../common/entities'
import { SubmitAccountAvatarRequest } from './requests'

export class AccountAvatar {
  public constructor(private readonly apiService: ApiService) {}

  /**
   * Retrieves a profile picture for specified account. Allows anonymous access.
   * Permissions: Public
   *
   * @param request must implement Entity
   * @return Promise<string> Raw buffer image content.
   */
  public get(request: Entity): Promise<string> {
    return this.apiService.request({
      endpoint: `/account/${request.id}/avatar`,
      method: 'GET',
      version: '2.0'
    })
  }

  /**
   * Creates or updates profile picture for specified account.
   *
   * @param request must implement SubmitAccountAvatarRequest
   * @return Promise<void>
   */
  public submit(request: SubmitAccountAvatarRequest): Promise<void> {
    return this.apiService.request({
      endpoint: `/account/${request.id}/avatar`,
      method: 'PUT',
      version: '2.0',
      data: request
    })
  }

  /**
   * Removes profile picture for specified account.
   *
   * @param request must implement Entity
   * @return Promise<void>
   */
  public delete(request: Entity): Promise<void> {
    return this.apiService.request({
      endpoint: `/account/${request.id}/avatar`,
      method: 'DELETE',
      version: '2.0'
    })
  }
}
