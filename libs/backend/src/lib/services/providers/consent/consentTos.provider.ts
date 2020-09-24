import { Injectable } from '@angular/core';
import { ApiService } from '../../api.service';

import { Entity } from '../../shared';
import { CreateConsentTosRequest, GetAllConsentTosRequest } from './requests';
import { ConsentTosSingle, GetAllConsentTosResponse } from './responses';

@Injectable({
  providedIn: 'root'
})
export class ConsentTos {
  public constructor(private readonly apiService: ApiService) {}

  /**
   * Gets all defined terms of service using specified filters.
   * Permissions: Public
   *
   * @param [request] must implement GetAllConsentTosRequest
   * @return Promise<GetAllConsentTosResponse>
   */
  public getAll(request?: GetAllConsentTosRequest): Promise<GetAllConsentTosResponse> {
    return this.apiService.request({
      endpoint: `/consent/tos`,
      method: 'GET',
      version: '1.0',
      data: request
    });
  }

  /**
   * Gets specified terms of service version by ID.
   * Permissions: Public
   *
   * @param request must implement Entity
   * @return Promise<ConsentTosSingle>
   */
  public getSingle(request: Entity): Promise<ConsentTosSingle> {
    return this.apiService.request({
      endpoint: `/consent/tos/${request.id}`,
      method: 'GET',
      version: '1.0'
    });
  }

  /**
   * Creates a new ToS version.
   * Permissions: Admin
   *
   * @param request must implement CreateConsentTosRequest
   * @return Promise<Entity> ID for the new ToS version record
   */
  public create(request: CreateConsentTosRequest): Promise<Entity> {
    return this.apiService
      .request({
        endpoint: `/consent/tos`,
        method: 'POST',
        version: '1.0',
        data: request
      })
      .then(res => ({ id: res.tosVersionId.toString() }));
  }
}
