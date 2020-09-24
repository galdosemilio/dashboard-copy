import { Injectable } from '@angular/core';
import { ApiService } from '../../api.service';

import { Entity } from '../../shared';
import {
  CreateSupplementAccountOrganizationRequest,
  GetAllSupplementAccountOrganizationRequest,
  UpdateSupplementAccountOrganizationRequest
} from './requests';
import { GetAllSupplementAccountOrganizationResponse } from './responses';

@Injectable({
  providedIn: 'root'
})
export class SupplementAccountOrganization {
  public constructor(private readonly apiService: ApiService) {}

  /**
   * Get association between supplement, organization and client account.
   * Permissions: Provider, Client, OrgAccess, OrgClientPHI
   *
   * @param request must implement GetAllSupplementAccountOrganizationRequest
   * @return Promise<GetAllSupplementAccountOrganizationResponse>
   */
  public getAll(
    request: GetAllSupplementAccountOrganizationRequest
  ): Promise<GetAllSupplementAccountOrganizationResponse> {
    return this.apiService.request({
      endpoint: `/supplement/account/organization/`,
      method: 'GET',
      version: '2.0',
      data: request
    });
  }

  /**
   * Create association between supplement organization and client account.
   * Permissions: Provider, OrgAccess, OrgClientPHI
   *
   * @param request must implement CreateSupplementAccountOrganizationRequest
   * @return Promise<Entity> Association ID
   */
  public create(request: CreateSupplementAccountOrganizationRequest): Promise<Entity> {
    return this.apiService
      .request({
        endpoint: `/supplement/account/organization/`,
        method: 'POST',
        version: '2.0',
        data: request
      })
      .then(res => ({ id: res.supplementOrganizationAccountId.toString() }));
  }

  /**
   * Update dosage in association between supplement organization and client account.
   * Permissions: Provider, OrgAccess, OrgClientPHI
   *
   * @param request must implement UpdateSupplementAccountOrganizationRequest
   * @return Promise<void>
   */
  public update(request: UpdateSupplementAccountOrganizationRequest): Promise<void> {
    return this.apiService.request({
      endpoint: `/supplement/account/organization/${request.id}`,
      method: 'PUT',
      version: '2.0',
      data: request
    });
  }

  /**
   * Delete association between supplement organization and client account.
   * Permissions: Provider, OrgAccess, OrgClientPHI
   *
   * @param request must implement Entity
   * @return Promise<void>
   */
  public delete(request: Entity): Promise<void> {
    return this.apiService.request({
      endpoint: `/supplement/account/organization/${request.id}`,
      method: 'DELETE',
      version: '2.0'
    });
  }
}
