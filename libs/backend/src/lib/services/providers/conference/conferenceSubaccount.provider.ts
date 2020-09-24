import { Injectable } from '@angular/core';
import { ApiService } from '../../api.service';

import { Entity } from '../../shared';
import { CreateConferenceSubaccountRequest, GetAllConferenceSubaccountRequest } from './requests';
import { ConferenceSubaccountSingle, GetAllConferenceSubaccountResponse } from './responses';

@Injectable({
  providedIn: 'root'
})
export class ConferenceSubaccount {
  public constructor(private readonly apiService: ApiService) {}

  /**
   * Change the API key for a subaccount by revoking the old one and generating a new key.
   * Permissions: Admin, Provider, OrgAdmin
   *
   * @param request must implement Entity
   * @return Promise<void>
   */
  public createKey(request: Entity): Promise<void> {
    return this.apiService.request({
      endpoint: `/conference/subaccount/${request.id}/key`,
      method: 'POST',
      version: '1.0'
    });
  }

  /**
   * Add subaccount for specified organization.
   * Permissions: Admin, Provider, OrgAdmin
   *
   * @param request must implement CreateConferenceSubaccountRequest
   * @return Promise<Entity>
   */
  public create(request: CreateConferenceSubaccountRequest): Promise<Entity> {
    return this.apiService.request({
      endpoint: `/conference/subaccount/`,
      method: 'POST',
      version: '1.0',
      data: request
    });
  }

  /**
   * Retrieves all subaccounts for a specified organization.
   *
   * @param request must implement GetAllConferenceSubaccountRequest
   * @return Promise<GetAllConferenceSubaccountResponse>
   */
  public getAll(
    request: GetAllConferenceSubaccountRequest
  ): Promise<GetAllConferenceSubaccountResponse> {
    return this.apiService.request({
      endpoint: `/conference/subaccount`,
      method: 'GET',
      version: '1.0',
      data: request
    });
  }

  /**
   * Retrieves details of a single subaccount.
   *
   * @param request must implement Entity
   * @return Promise<ConferenceSubaccountSingle>
   */
  public getSingle(request: Entity): Promise<ConferenceSubaccountSingle> {
    return this.apiService.request({
      endpoint: `/conference/subaccount/${request.id}`,
      method: 'GET',
      version: '1.0'
    });
  }

  /**
   * Removes a subaccount.
   * Permissions: Admin, Provider, OrgAdmin
   *
   * @param request must implement Entity
   * @return Promise<void>
   */
  public delete(request: Entity): Promise<void> {
    return this.apiService.request({
      endpoint: `/conference/subaccount/${request.id}`,
      method: 'DELETE',
      version: '1.0'
    });
  }
}
