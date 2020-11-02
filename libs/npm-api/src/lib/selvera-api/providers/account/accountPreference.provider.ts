import { Injectable } from '@angular/core'
import { ApiService } from '../../services/api.service'
import { Entity } from '../common/entities'
import {
  CreateAccountPreferenceRequest,
  UpdateAccountPreferenceRequest
} from './requests'
import { AccountPreferenceSingle } from './responses'

@Injectable()
export class AccountPreference {
  public constructor(private readonly apiService: ApiService) {}

  /**
   * Retrieves an account preference.
   * Permissions: OrgAccess, OrgClientPHI
   *
   * @param request must implement Entity
   * @return Promise<AccountPreferenceSingle>
   */
  public getSingle(request: Entity): Promise<AccountPreferenceSingle> {
    return this.apiService.request({
      endpoint: `/account/${request.id}/preference`,
      method: 'GET',
      version: '2.0'
    })
  }

  /**
   * Creates preference entry for specified account.
   * Permissions: OrgAdmin, OrgAccess, OrgClientPHI
   *
   * @param request must implement CreateAccountPreferenceRequest
   * @return Promise<Entity>
   */
  public create(request: CreateAccountPreferenceRequest): Promise<Entity> {
    return this.apiService.request({
      endpoint: `/account/${request.id}/preference`,
      method: 'POST',
      version: '2.0',
      data: request
    })
  }

  /**
   * Updates preference entry for specified account.
   * Permissions: OrgAdmin, OrgAccess, OrgClientPHI
   *
   * @param request must implement UpdateAccountPreferenceRequest
   * @return Promise<void>
   */
  public update(request: UpdateAccountPreferenceRequest): Promise<void> {
    return this.apiService.request({
      endpoint: `/account/${request.id}/preference`,
      method: 'PATCH',
      version: '2.0',
      data: request
    })
  }
}
