import { ApiService } from '../../services/api.service'
import { Entity } from '../common/entities'
import {
  CreateContentPackageRequest,
  DeleteContentPackageRequest
} from './requests'
import { GetAllContentPackageResponse } from './responses'

export class ContentPackage {
  public constructor(private readonly apiService: ApiService) {}

  /**
   * Retrieves a list of packages associated with a given content item.
   * Permissions: Admin, Provider
   *
   * @param request must implement Entity
   * @return Promise<GetAllContentPackageResponse>
   */
  public getAll(request: Entity): Promise<GetAllContentPackageResponse> {
    return this.apiService.request({
      endpoint: `/content/${request.id}/package`,
      method: 'GET',
      version: '1.0'
    })
  }

  /**
   * Deletes the association between an item and a package.
   * Permissions: Admin, Provider
   *
   * @param request must implement DeleteContentPackageRequest
   * @return Promise<void>
   */
  public delete(request: DeleteContentPackageRequest): Promise<void> {
    return this.apiService.request({
      endpoint: `/content/${request.id}/package/${request.package}`,
      method: 'DELETE',
      version: '1.0'
    })
  }

  /**
   * Creates a new association between a content item an a package.
   * Permissions: Admin, Provider
   *
   * @param request must implement CreateContentPackageRequest
   * @return Promise<void>
   */
  public create(request: CreateContentPackageRequest): Promise<void> {
    return this.apiService.request({
      endpoint: `/content/${request.id}/package/${request.package}`,
      method: 'PUT',
      version: '1.0'
    })
  }
}
