import { ApiService } from '../../services/api.service'
import { Entity } from '../common/entities'

import {
  CreatePackageRequest,
  GetAllPackageRequest,
  UpdatePackageRequest
} from './requests'
import { GetAllPackageResponse, PackageSingle } from './responses'

export class Package {
  public constructor(private readonly apiService: ApiService) {}

  /**
   * Get listing of all packages and products.
   * Permissions: Admin, Provider
   *
   * @param [request] must implement GetAllPackageRequest
   * @return Promise<GetAllPackageResponse>
   */
  public getAll(
    request?: GetAllPackageRequest
  ): Promise<GetAllPackageResponse> {
    return this.apiService.request({
      endpoint: `/package`,
      method: 'GET',
      version: '2.0',
      data: request
    })
  }

  /**
   * Get single packages or product by id. Client can only fetch packages for organizations they are assigned to.
   * Permissions: Admin, Provider, Client
   *
   * @param request must implement Entity
   * @return Promise<PackageSingle>
   */
  public getSingle(request: Entity): Promise<PackageSingle> {
    return this.apiService.request({
      endpoint: `/package/${request.id}`,
      method: 'GET',
      version: '2.0'
    })
  }

  /**
   * Create new package or product.
   * Permissions: Admin
   *
   * @param request must implement CreatePackageRequest
   * @return Promise<Entity>
   */
  public create(request: CreatePackageRequest): Promise<Entity> {
    return this.apiService.request({
      endpoint: `/package`,
      method: 'POST',
      version: '2.0',
      data: request
    })
  }

  /**
   * Update particular package.
   * Permissions: Admin
   *
   * @param request must implement UpdatePackageRequest
   * @return Promise<void>
   */
  public update(request: UpdatePackageRequest): Promise<void> {
    return this.apiService.request({
      endpoint: `/package/${request.id}`,
      method: 'PATCH',
      version: '2.0',
      data: request
    })
  }
}
