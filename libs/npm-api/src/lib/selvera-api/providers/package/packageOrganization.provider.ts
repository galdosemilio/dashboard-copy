import { ApiService } from '../../services/api.service'
import { Entity } from '../common/entities'
import {
  CreatePackageOrganizationRequest,
  GetAllPackageOrganizationRequest,
  UpdatePackageOrganizationRequest
} from './requests'
import {
  GetAllPackageOrganizationResponse,
  PackageOrganizationSingle
} from './responses'

export class PackageOrganization {
  public constructor(private readonly apiService: ApiService) {}

  /**
   * Fetch package-organization associations by organization.
   * Permissions: Admin, Provider, OrgAssociation
   *
   * @param request must implement GetAllPackageOrganizationRequest
   * @return Promise<GetAllPackageOrganizationResponse>
   */
  public getAll(
    request: GetAllPackageOrganizationRequest
  ): Promise<GetAllPackageOrganizationResponse> {
    return this.apiService.request({
      endpoint: `/package/organization`,
      method: 'GET',
      version: '2.0',
      data: request
    })
  }

  /**
   * Fetch single package-organization association by ID.
   * Permissions: Admin, Provider, OrgAssociation
   *
   * @param request must implement Entity
   * @return Promise<PackageOrganizationSingle>
   */
  public getSingle(request: Entity): Promise<PackageOrganizationSingle> {
    return this.apiService.request({
      endpoint: `/package/organization/${request.id}`,
      method: 'GET',
      version: '2.0'
    })
  }

  /**
   * Create package-organization association.
   * Permissions: Admin, Provider, OrgAdmin
   *
   * @param request must implement CreatePackageOrganizationRequest
   * @return Promise<Entity>
   */
  public create(request: CreatePackageOrganizationRequest): Promise<Entity> {
    return this.apiService.request({
      endpoint: `/package/organization`,
      method: 'POST',
      version: '2.0',
      data: request
    })
  }

  /**
   * Update package-organization association data.
   * Permissions: Admin, Provider, OrgAdmin
   *
   * @param request must implement UpdatePackageOrganizationRequest
   * @return Promise<void>
   */
  public update(request: UpdatePackageOrganizationRequest): Promise<void> {
    return this.apiService.request({
      endpoint: `/package/organization/${request.id}`,
      method: 'PATCH',
      version: '2.0',
      data: request
    })
  }

  /**
   * Delete package-organization entry by specified ID.
   * Permissions: Admin, Provider
   *
   * @param request must implement Entity
   * @return Promise<void>
   */
  public delete(request: Entity): Promise<void> {
    return this.apiService.request({
      endpoint: `/package/organization/${request.id}`,
      method: 'DELETE',
      version: '2.0'
    })
  }
}
