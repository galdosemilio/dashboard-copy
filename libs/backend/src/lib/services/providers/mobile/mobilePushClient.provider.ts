import { Injectable } from '@angular/core';
import { ApiService } from '../../api.service';

import { Entity } from '../../shared';
import { GetAllMobilePushClientRequest, UpsertMobilePushClientRequest } from './requests';
import { GetAllMobilePushClientResponse, MobilePushClientSingle } from './responses';

@Injectable({
  providedIn: 'root'
})
export class MobilePushClient {
  public constructor(private readonly apiService: ApiService) {}

  /**
   * Upsert client token. Idempotent if token already present.
   * Permissions: Provider, Client
   *
   * @param request must implement UpsertMobilePushClientRequest
   * @return Promise<Entity>
   */
  public upsert(request: UpsertMobilePushClientRequest): Promise<Entity> {
    return this.apiService.request({
      endpoint: `/notification/mobile-push/client`,
      method: 'PUT',
      version: '2.0',
      data: request
    });
  }

  /**
   * Fetch clients.
   * Permissions: Admin, Provider, Client
   *
   * @param [request] must implement GetAllMobilePushClientRequest
   * @return Promise<GetAllMobilePushClientResponse>
   */
  public getAll(request?: GetAllMobilePushClientRequest): Promise<GetAllMobilePushClientResponse> {
    return this.apiService.request({
      endpoint: `/notification/mobile-push/client`,
      method: 'GET',
      version: '2.0',
      data: request
    });
  }

  /**
   * Fetch a single clients.
   * Permissions: Admin
   *
   * @param request must implement Entity
   * @return Promise<MobilePushClientSingle>
   */
  public getSingle(request: Entity): Promise<MobilePushClientSingle> {
    return this.apiService.request({
      endpoint: `/notification/mobile-push/client/${request.id}`,
      method: 'GET',
      version: '2.0'
    });
  }

  /**
   * Remove a single client.
   * Permissions: Admin, Provider, Client
   *
   * @param request must implement Entity
   * @return Promise<void>
   */
  public delete(request: Entity): Promise<void> {
    return this.apiService.request({
      endpoint: `/notification/mobile-push/client/${request.id}`,
      method: 'DELETE',
      version: '2.0'
    });
  }
}
