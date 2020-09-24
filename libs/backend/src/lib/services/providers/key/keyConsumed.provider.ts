import { Injectable } from '@angular/core';
import { ApiService } from '../../api.service';

import { Entity } from '../../shared';
import {
  CreateKeyConsumedRequest,
  GetAllKeyConsumedRequest,
  UpdateKeyConsumedRequest
} from './requests';
import { GetAllKeyConsumedResponse, KeyConsumedSingle } from './responses';

@Injectable({
  providedIn: 'root'
})
export class KeyConsumed {
  public constructor(private readonly apiService: ApiService) {}

  /**
   * Fetch all consumed keys.
   * Permissions: Provider, Client, OrgAccess, OrgClientPHI
   *
   * @param request must implement GetAllKeyConsumedRequest
   * @return Promise<GetAllKeyConsumedResponse>
   */
  public getAll(request: GetAllKeyConsumedRequest): Promise<GetAllKeyConsumedResponse> {
    return this.apiService.request({
      endpoint: `/key/consumed`,
      method: 'GET',
      version: '2.0',
      data: request
    });
  }

  /**
   * Fetch single consumed key.
   * Permissions: Provider, Client
   *
   * @param request must implement Entity
   * @return Promise<KeyConsumedSingle>
   */
  public getSingle(request: Entity): Promise<KeyConsumedSingle> {
    return this.apiService.request({
      endpoint: `/key/consumed/${request.id}`,
      method: 'GET',
      version: '2.0'
    });
  }

  /**
   * Add a consumed key.
   * Permissions: Client
   *
   * @param request must implement CreateKeyConsumedRequest
   * @return Promise<Entity> The id of the newly-created consumed meal's key record
   */
  public create(request: CreateKeyConsumedRequest): Promise<Entity> {
    return this.apiService
      .request({
        endpoint: `/key/consumed`,
        method: 'POST',
        version: '2.0',
        data: request
      })
      .then(res => ({ id: res.consumedId.toString() }));
  }

  /**
   * Update a consumed key.
   * Permissions: Client
   *
   * @param request must implement UpdateKeyConsumedRequest
   * @return Promise<void>
   */
  public update(request: UpdateKeyConsumedRequest): Promise<void> {
    return this.apiService.request({
      endpoint: `/key/consumed/${request.id}`,
      method: 'PATCH',
      version: '2.0',
      data: request
    });
  }

  /**
   * Delete consumed.
   * Permissions: Client
   *
   * @param request must implement Entity
   * @return Promise<void>
   */
  public delete(request: Entity): Promise<void> {
    return this.apiService.request({
      endpoint: `/key/consumed/${request.id}`,
      method: 'DELETE',
      version: '2.0'
    });
  }
}
