import { Injectable } from '@angular/core';
import { ApiService } from '../../api.service';

import { Entity } from '../../shared';
import {
  CreateKeyAccountRequest,
  GetAllKeyAccountRequest,
  UpdateKeyAccountRequest
} from './requests';
import { GetAllKeyAccountResponse, KeyAccountSingle } from './responses';

@Injectable({
  providedIn: 'root'
})
export class KeyAccount {
  public constructor(private readonly apiService: ApiService) {}

  /**
   * Associate key-organization entry with account. Providers able to create keys for clients from all accessible organizations.
   * Clients can create only their own keys.
   * Permissions: Provider, Client
   *
   * @param request must implement CreateKeyAccountRequest
   * @return Promise<Entity> Association ID
   */
  public create(request: CreateKeyAccountRequest): Promise<Entity> {
    return this.apiService
      .request({
        endpoint: `/key/account`,
        method: 'POST',
        version: '2.0',
        data: request
      })
      .then(res => ({ id: res.keyOrganizationAccountId.toString() }));
  }

  /**
   * Update key-organization-account association. Providers able to update keys for clients from all accessible organizations.
   * Clients can update only their own keys.
   * Permissions: Provider, Client
   *
   * @param request must implement UpdateKeyAccountRequest
   * @return Promise<void>
   */
  public update(request: UpdateKeyAccountRequest): Promise<void> {
    return this.apiService.request({
      endpoint: `/key/account/${request.id}`,
      method: 'PATCH',
      version: '2.0',
      data: request
    });
  }

  /**
   * Fetch key-organization-account association by ID.
   * Providers able to fetch keys for clients from all accessible organizations. Clients can fetch only their own keys.
   * Permissions: Provider, Client
   *
   * @param request must implement Entity
   * @return Promise<KeyAccountSingle>
   */
  public getSingle(request: Entity): Promise<KeyAccountSingle> {
    return this.apiService.request({
      endpoint: `/key/account/${request.id}`,
      method: 'GET',
      version: '2.0'
    });
  }

  /**
   * Get all organization-account keys. Providers able to fetch keys for clients from all accessible organizations.
   * Clients can fetch only their own keys.
   * Permissions: Provider, Client
   *
   * @param request must implement GetAllKeyAccountRequest
   * @return Promise<GetAllKeyAccountResponse>
   */
  public getAll(request: GetAllKeyAccountRequest): Promise<GetAllKeyAccountResponse> {
    return this.apiService.request({
      endpoint: `/key/account`,
      method: 'GET',
      version: '2.0',
      data: request
    });
  }

  /**
   * Delete key-organization-account entry by specified ID.
   * Providers able to remove keys for clients from all accessible organizations. Clients can remove only their own keys.
   * Permissions: Provider, Client
   *
   * @param request must implement Entity
   * @return Promise<void>
   */
  public delete(request: Entity): Promise<void> {
    return this.apiService.request({
      endpoint: `/key/account/${request.id}`,
      method: 'DELETE',
      version: '2.0'
    });
  }
}
