import { Injectable } from '@angular/core';
import { ApiService } from '../../api.service';

import { Entity } from '../../shared';
import {
  CreateKeyOrganizationRequest,
  GetAllKeyOrganizationRequest,
  UpdateKeyOrganizationRequest
} from './requests';
import { GetAllKeyOrganizationResponse, KeyOrganizationSingle } from './responses';

@Injectable({
  providedIn: 'root'
})
export class KeyOrganization {
  public constructor(private readonly apiService: ApiService) {}

  /**
   * Associate key with organization.
   * Permissions: Provider, OrgAdmin
   *
   * @param request must implement CreateKeyOrganizationRequest
   * @return Promise<Entity> Association ID
   */
  public create(request: CreateKeyOrganizationRequest): Promise<Entity> {
    return this.apiService
      .request({
        endpoint: `/key/organization`,
        method: 'POST',
        version: '2.0',
        data: request
      })
      .then(res => ({ id: res.keyOrganizationId.toString() }));
  }

  /**
   * Update|Deactivate key-organization association.
   * Permissions: Provider, OrgAdmin
   *
   * @param request must implement UpdateKeyOrganizationRequest
   * @return Promise<void>
   */
  public update(request: UpdateKeyOrganizationRequest): Promise<void> {
    return this.apiService.request({
      endpoint: `/key/organization/${request.id}`,
      method: 'PATCH',
      version: '2.0',
      data: request
    });
  }

  /**
   * Fetch key-organization association by ID.
   * Permissions: Provider, Client
   *
   * @param request must implement Entity
   * @return Promise<KeyOrganizationSingle>
   */
  public getSingle(request: Entity): Promise<KeyOrganizationSingle> {
    return this.apiService.request({
      endpoint: `/key/organization/${request.id}`,
      method: 'GET',
      version: '2.0'
    });
  }

  /**
   * Get all keys.
   * Permissions: Provider, Client
   *
   * @param request must implement GetAllKeyOrganizationRequest
   * @return Promise<GetAllKeyOrganizationResponse>
   */
  public getAll(request: GetAllKeyOrganizationRequest): Promise<GetAllKeyOrganizationResponse> {
    return this.apiService.request({
      endpoint: `/key/organization`,
      method: 'GET',
      version: '2.0',
      data: request
    });
  }

  /**
   * Delete key-organization entry by specified ID.
   * Permissions: Provider, OrgAdmin
   *
   * @param request must implement Entity
   * @return Promise<void>
   */
  public delete(request: Entity): Promise<void> {
    return this.apiService.request({
      endpoint: `/key/organization/${request.id}`,
      method: 'DELETE',
      version: '2.0'
    });
  }
}
