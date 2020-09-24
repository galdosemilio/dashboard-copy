import { Injectable } from '@angular/core';
import { ApiService } from '../../api.service';

import { Entity } from '../../shared';
import {
  CreatePackageEnrollmentRequest,
  GetAllPackageEnrollmentRequest,
  UpdatePackageEnrollmentRequest
} from './requests';
import { GetAllPackageEnrollmentResponse, PackageEnrollmentSingle } from './responses';

@Injectable({
  providedIn: 'root'
})
export class PackageEnrollment {
  public constructor(private readonly apiService: ApiService) {}

  /**
   * Fetch all enrollments.
   * Permissions: Provider, Client, OrgAssociation
   *
   * @param request must implement GetAllPackageEnrollmentRequest
   * @return Promise<GetAllPackageEnrollmentResponse>
   */
  public getAll(request: GetAllPackageEnrollmentRequest): Promise<GetAllPackageEnrollmentResponse> {
    return this.apiService.request({
      endpoint: `/package/enrollment`,
      method: 'GET',
      version: '2.0',
      data: request
    });
  }

  /**
   * Fetch single enrollment. Providers may only fetch enrollment for user they have access to.
   * Permissions: Provider, Client, OrgAssociation
   *
   * @param request must implement Entity
   * @return Promise<PackageEnrollmentSingle>
   */
  public getSingle(request: Entity): Promise<PackageEnrollmentSingle> {
    return this.apiService.request({
      endpoint: `/package/enrollment/${request.id}`,
      method: 'GET',
      version: '2.0'
    });
  }

  /**
   * Add new enrollment entry. Available to admins, managers, providers, and clients.
   * Permissions: Provider, Client, OrgAdmin
   *
   * @param request must implement CreatePackageEnrollmentRequest
   * @return Promise<Entity>
   */
  public create(request: CreatePackageEnrollmentRequest): Promise<Entity> {
    return this.apiService.request({
      endpoint: `/package/enrollment`,
      method: 'POST',
      version: '2.0',
      data: request
    });
  }

  /**
   * Update enrollment details (e.g. deactivate enrollment)
   * Permissions: Provider, Client, OrgAdmin
   *
   * @param request must implement UpdatePackageEnrollmentRequest
   * @return Promise<void>
   */
  public update(request: UpdatePackageEnrollmentRequest): Promise<void> {
    return this.apiService.request({
      endpoint: `/package/enrollment/${request.id}`,
      method: 'PATCH',
      version: '2.0',
      data: request
    });
  }

  /**
   * Delete enrollment entry. Admins, managers, and providers have access to this endpoint.
   * Managers can only unenroll for packages in their organization.
   * Providers can only access clients they have permission to, and packages they are part of the same organization of.
   * Permissions: Admin, Provider
   *
   * @param request must implement Entity
   * @return Promise<void>
   */
  public delete(request: Entity): Promise<void> {
    return this.apiService.request({
      endpoint: `/package/enrollment/${request.id}`,
      method: 'DELETE',
      version: '1.0'
    });
  }
}
