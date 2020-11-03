import { ApiService } from '../../services/api.service'

import { Entity } from '../common/entities'
import { CreateFoodServingRequest, UpdateFoodServingRequest } from './requests'
import { FoodServingSingle } from './responses'

export class FoodServing {
  public constructor(private readonly apiService: ApiService) {}

  /**
   * Gets a local serving.
   *
   * @param request must implement Entity
   * @return Promise<FoodServingSingle>
   */
  public getSingle(request: Entity): Promise<FoodServingSingle> {
    return this.apiService.request({
      endpoint: `/food/serving/${request.id}`,
      method: 'GET',
      version: '1.0'
    })
  }

  /**
   * Creates a local serving.
   * Permissions: Admin
   *
   * @param request must implement CreateFoodServingRequest
   * @return Promise<Entity>
   */
  public create(request: CreateFoodServingRequest): Promise<Entity> {
    return this.apiService.request({
      endpoint: `/food/serving`,
      method: 'POST',
      version: '1.0',
      data: request
    })
  }

  /**
   * Updates a local serving.
   * Permissions: Admin
   *
   * @param request must implement UpdateFoodServingRequest
   * @return Promise<void>
   */
  public update(request: UpdateFoodServingRequest): Promise<void> {
    return this.apiService.request({
      endpoint: `/food/serving/${request.id}`,
      method: 'PATCH',
      version: '1.0',
      data: request
    })
  }

  /**
   * Deletes a local serving. Will only succeed if a serving has no other relations.
   * Permissions: Admin
   *
   * @param request must implement Entity
   * @return Promise<void>
   */
  public delete(request: Entity): Promise<void> {
    return this.apiService.request({
      endpoint: `/food/serving/${request.id}`,
      method: 'DELETE',
      version: '1.0'
    })
  }
}
