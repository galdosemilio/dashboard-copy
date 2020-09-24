import { Injectable } from '@angular/core';
import { ApiService } from '../../api.service';

import { Entity } from '../../shared';
import {
  CreateSupplementOrganizationRequest,
  GetAllSupplementOrganizationRequest,
  UpdateSupplementOrganizationRequest
} from './requests';
import { GetAllSupplementOrganizationResponse, SupplementOrganizationSingle } from './responses';

@Injectable({
  providedIn: 'root'
})
export class SupplementOrganization {
  public constructor(private readonly apiService: ApiService) {}

  /**
   * Fetch supplements by organization, along with their association IDs.
   * Permissions: Provider, Client
   *
   * @param request must implement GetAllSupplementOrganizationRequest
   * @return Promise<GetAllSupplementOrganizationResponse>
   */
  public getAll(
    request: GetAllSupplementOrganizationRequest
  ): Promise<GetAllSupplementOrganizationResponse> {
    return this.apiService.request({
      endpoint: `/supplement/organization`,
      method: 'GET',
      version: '3.0',
      data: request
    });
  }

  /**
   * Fetch supplement-organization association by ID.
   * Permissions: Provider, Client
   *
   * @param request must implement Entity
   * @return Promise<SupplementOrganizationSingle>
   */
  public getSingle(request: Entity): Promise<SupplementOrganizationSingle> {
    return this.apiService.request({
      endpoint: `/supplement/organization/${request.id}`,
      method: 'GET',
      version: '2.0'
    });
  }

  /**
   * Associate sumplement with organization.
   * Permissions: Provider
   *
   * @param request must implement CreateSupplementOrganizationRequest
   * @return Promise<Entity> Association ID
   */
  public create(request: CreateSupplementOrganizationRequest): Promise<Entity> {
    return this.apiService
      .request({
        endpoint: `/supplement/organization`,
        method: 'POST',
        version: '2.0',
        data: request
      })
      .then(res => ({ id: res.supplementOrganizationId.toString() }));
  }

  /**
   * Update dosage on supplement-organization association.
   * Permissions: Provider
   *
   * @param request must implement UpdateSupplementOrganizationRequest
   * @return Promise<void>
   */
  public update(request: UpdateSupplementOrganizationRequest): Promise<void> {
    return this.apiService.request({
      endpoint: `/supplement/organization/${request.id}`,
      method: 'PUT',
      version: '2.0',
      data: request
    });
  }

  /**
   * Delete supplement-organization entry by specified ID.
   * Permissions: Provider
   *
   * @param request must implement Entity
   * @return Promise<void>
   */
  public delete(request: Entity): Promise<void> {
    return this.apiService.request({
      endpoint: `/supplement/organization/${request.id}`,
      method: 'DELETE',
      version: '2.0'
    });
  }
}
