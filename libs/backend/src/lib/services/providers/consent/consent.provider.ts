import { Injectable } from '@angular/core';
import { ApiService } from '../../api.service';

import { Entity } from '../../shared';
import { CreateConsentRequest, GetAllConsentRequest } from './requests';
import { ConsentSingle, GetAllConsentResponse } from './responses';

@Injectable({
  providedIn: 'root'
})
export class Consent {
  public constructor(private readonly apiService: ApiService) {}

  /**
   * Gets all defined consents using specified filters.
   * Permissions: OrgAdmin, OrgClientPHI
   *
   * @param [request] must implement GetAllConsentRequest
   * @return Promise<GetAllConsentResponse>
   */
  public getAll(request?: GetAllConsentRequest): Promise<GetAllConsentResponse> {
    return this.apiService.request({
      endpoint: `/consent`,
      method: 'GET',
      version: '1.0',
      data: request
    });
  }

  /**
   * Gets a single consent by ID.
   *
   * @param request must implement Entity
   * @return Promise<ConsentSingle>
   */
  public getSingle(request: Entity): Promise<ConsentSingle> {
    return this.apiService.request({
      endpoint: `/consent/${request.id}`,
      method: 'GET',
      version: '1.0'
    });
  }

  /**
   * Creates a consent.
   * Permissions: OrgAdmin, OrgClientPHI
   *
   * @param request must implement CreateConsentRequest
   * @return Promise<Entity> ID for the new ToS consent record
   */
  public create(request: CreateConsentRequest): Promise<Entity> {
    return this.apiService
      .request({
        endpoint: `/consent`,
        method: 'POST',
        version: '1.0',
        data: request
      })
      .then(res => ({ id: res.consentId.toString() }));
  }
}
