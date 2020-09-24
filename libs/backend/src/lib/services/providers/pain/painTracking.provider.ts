import { Injectable } from '@angular/core';
import { ApiService } from '../../api.service';

import { Entity } from '../../shared';
import {
  CreatePainTrackingRequest,
  GetAllPainTrackingRequest,
  UpdatePainTrackingRequest
} from './requests';
import {
  GetAllPainTrackingResponse,
  GetTypesPainTrackingResponse,
  PainTrackingSingle
} from './responses';

@Injectable({
  providedIn: 'root'
})
export class PainTracking {
  public constructor(private readonly apiService: ApiService) {}

  /**
   * Inserts pain location and relevant data for specified account.
   * Permissions: Client
   *
   * @param request must implement CreatePainTrackingRequest
   * @return Promise<Entity>
   */
  public create(request: CreatePainTrackingRequest): Promise<Entity> {
    return this.apiService.request({
      endpoint: `/pain-tracking/history`,
      method: 'POST',
      version: '1.0',
      data: request
    });
  }

  /**
   * Gets list of pain location for specified user and datetime.
   * Permissions: Provider, Client, OrgAccess, OrgClientPHI
   *
   * @param request must implement GetAllPainTrackingRequest
   * @return Promise<GetAllPainTrackingResponse>
   */
  public getAll(request: GetAllPainTrackingRequest): Promise<GetAllPainTrackingResponse> {
    return this.apiService.request({
      endpoint: `/pain-tracking/history`,
      method: 'GET',
      version: '1.0',
      data: request
    });
  }

  /**
   * Gets single pain location.
   * Permissions: Provider, Client, OrgAccess, OrgClientPHI
   *
   * @param request must implement Entity
   * @return Promise<PainTrackingSingle>
   */
  public getSingle(request: Entity): Promise<PainTrackingSingle> {
    return this.apiService.request({
      endpoint: `/pain-tracking/history/${request.id}`,
      method: 'GET',
      version: '1.0'
    });
  }

  /**
   * Deletes single pain location.
   * Permissions: Client
   *
   * @param request must implement Entity
   * @return Promise<void>
   */
  public delete(request: Entity): Promise<void> {
    return this.apiService.request({
      endpoint: `/pain-tracking/history/${request.id}`,
      method: 'DELETE',
      version: '1.0'
    });
  }

  /**
   * Updates pain location data.
   * Permissions: Client
   *
   * @param request must implement UpdatePainTrackingRequest
   * @return Promise<void>
   */
  public update(request: UpdatePainTrackingRequest): Promise<void> {
    return this.apiService.request({
      endpoint: `/pain-tracking/history`,
      method: 'PATCH',
      version: '1.0',
      data: request
    });
  }

  /**
   * Gets all pain types.
   *
   * @return Promise<GetTypesPainTrackingResponse>
   */
  public getTypes(): Promise<GetTypesPainTrackingResponse> {
    return this.apiService.request({
      endpoint: `/pain-tracking/type`,
      method: 'GET',
      version: '1.0'
    });
  }
}
