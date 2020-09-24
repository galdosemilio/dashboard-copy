import { Injectable } from '@angular/core';
import { ApiService } from '../../api.service';

import { Entity } from '../../shared';
import {
  CreateOrganizationRequest,
  GetAllOrganizationRequest,
  GetDescendantsOrganizationRequest,
  GetListOrganizationRequest,
  UpdateOrganizationRequest
} from './requests';
import {
  GetAllOrganizationResponse,
  GetDescendantsOrganizationResponse,
  GetListOrganizationResponse,
  OrganizationSingle
} from './responses';

@Injectable({
  providedIn: 'root'
})
export class Organization {
  public constructor(private readonly apiService: ApiService) {}

  /**
   * Get a listing of accessible organizations for an account.
   * Permissions: Provider, Client, OrgAccess
   *
   * @param [request] must implement GetListOrganizationRequest
   * @return Promise<GetListOrganizationResponse>
   */
  public getList(request?: GetListOrganizationRequest): Promise<GetListOrganizationResponse> {
    return this.apiService.request({
      endpoint: `/access/organization`,
      method: 'GET',
      version: '2.0',
      data: request
    });
  }

  /**
   * Create new organization entry.
   * Providers can only create organization entries with parent organizations that they have admin access to.
   * Permissions: Admin, Provider, OrgAdmin
   *
   * @param request must implement CreateOrganizationRequest
   * @return Promise<Entity>
   */
  public create(request: CreateOrganizationRequest): Promise<Entity> {
    return this.apiService.request({
      endpoint: `/organization`,
      method: 'POST',
      version: '2.0',
      data: request
    });
  }

  /**
   * Update organization entry.
   * Permissions: Admin, Provider, OrgAdmin
   *
   * @param request must implement UpdateOrganizationRequest
   * @return Promise<void>
   */
  public update(request: UpdateOrganizationRequest): Promise<void> {
    return this.apiService.request({
      endpoint: `/organization/${request.id}`,
      method: 'PUT',
      version: '2.0',
      data: request
    });
  }

  /**
   * Deactivates (deletes) an existing organization.
   * Permissions: Admin
   *
   * @param request must implement Entity
   * @return Promise<Entity>
   */
  public delete(request: Entity): Promise<Entity> {
    return this.apiService.request({
      endpoint: `/organization/${request.id}`,
      method: 'DELETE',
      version: '2.0'
    });
  }

  /**
   * Retrieve a list of organizations.
   * Permissions: Admin
   *
   * @param [request] must implement GetAllOrganizationRequest
   * @return Promise<GetAllOrganizationResponse>
   */
  public getAll(request?: GetAllOrganizationRequest): Promise<GetAllOrganizationResponse> {
    return this.apiService.request({
      endpoint: `/organization/`,
      method: 'GET',
      version: '2.0',
      data: request
    });
  }

  /**
   * Retrieve an existing organization.
   *
   * @param request must implement Entity
   * @return Promise<OrganizationSingle>
   */
  public getSingle(request: Entity): Promise<OrganizationSingle> {
    return this.apiService.request({
      endpoint: `/organization/${request.id}`,
      method: 'GET',
      version: '2.0'
    });
  }

  /**
   * Retrieve all descendants of an organization.
   * Permissions: Public
   *
   * @param request must implement GetDescendantsOrganizationRequest
   * @return Promise<GetDescendantsOrganizationResponse>
   */
  public getDescendants(
    request: GetDescendantsOrganizationRequest
  ): Promise<GetDescendantsOrganizationResponse> {
    return this.apiService.request({
      endpoint: `/organization/${request.id}/descendants`,
      method: 'GET',
      version: '2.0',
      data: request
    });
  }
}
