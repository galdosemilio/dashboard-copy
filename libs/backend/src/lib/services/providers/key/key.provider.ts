import { Injectable } from '@angular/core';
import { ApiService } from '../../api.service';

import { Entity } from '../../shared';
import { CreateKeyRequest, GetAllKeyRequest, UpdateKeyRequest } from './requests';
import { GetAllKeyResponse } from './responses';

@Injectable({
  providedIn: 'root'
})
export class Key {
  public constructor(private readonly apiService: ApiService) {}

  /**
   * Fetches all available keys according to query parameters.
   * Permissions: Admin
   *
   * @param [request] must implement GetAllKeyRequest
   * @return Promise<GetAllKeyResponse>
   */
  public getAll(request?: GetAllKeyRequest): Promise<GetAllKeyResponse> {
    return this.apiService.request({
      endpoint: `/key`,
      method: 'GET',
      version: '2.0',
      data: request
    });
  }

  /**
   * Adds key with given parameters at body of request.
   * Permissions: Admin
   *
   * @param request must implement CreateKeyRequest
   * @return Promise<Entity>
   */
  public create(request: CreateKeyRequest): Promise<Entity> {
    return this.apiService.request({
      endpoint: `/key`,
      method: 'POST',
      version: '2.0',
      data: request
    });
  }

  /**
   * Modifies key with given parameters at body of request. At least one property has to be present for an update.
   * Permissions: Admin
   *
   * @param request must implement UpdateKeyRequest
   * @return Promise<void>
   */
  public update(request: UpdateKeyRequest): Promise<void> {
    return this.apiService.request({
      endpoint: `/key`,
      method: 'PATCH',
      version: '2.0',
      data: request
    });
  }
}
