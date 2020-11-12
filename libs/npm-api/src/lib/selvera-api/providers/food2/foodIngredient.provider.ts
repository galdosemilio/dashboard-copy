import { ApiService } from '../../services/api.service'

import { Entity } from '../common/entities'
import {
  CopyFoodIngredientRequest,
  CreateLocalFoodIngredientRequest,
  GetRemoteFoodIngredientRequest,
  GetUPCFoodIngredientRequest,
  UpdateLocalFoodIngredientRequest
} from './requests'
import {
  CreateLocalFoodIngredientResponse,
  GetLocalFoodIngredientResponse,
  GetRemoteFoodIngredientResponse,
  GetUPCFoodIngredientResponse
} from './responses'

export class FoodIngredient {
  public constructor(private readonly apiService: ApiService) {}

  /**
   * Gets a local ingredient.
   *
   * @param request must implement Entity
   * @return Promise<GetLocalFoodIngredientResponse>
   */
  public getLocal(request: Entity): Promise<GetLocalFoodIngredientResponse> {
    return this.apiService.request({
      endpoint: `/food/ingredient/local/${request.id}`,
      method: 'GET',
      version: '2.0'
    })
  }

  /**
   * Looks up a UPC ingredient in both local and remote data store.
   * First locally and if the ingredient is not found, then remotely.
   *
   * @param request must implement GetUPCFoodIngredientRequest
   * @return Promise<GetUPCFoodIngredientResponse>
   */
  public getUpc(
    request: GetUPCFoodIngredientRequest
  ): Promise<GetUPCFoodIngredientResponse> {
    return this.apiService.request({
      endpoint: `/food/ingredient/upc/${request.id}`,
      method: 'GET',
      version: '2.0',
      data: request
    })
  }

  /**
   * Looks up a remote ingredient and copies it over, with servings.
   *
   * @param request must implement CopyFoodIngredientRequest
   * @return Promise<Entity>
   */
  public copy(request: CopyFoodIngredientRequest): Promise<Entity> {
    return this.apiService.request({
      endpoint: `/food/ingredient/copy/${request.id}`,
      method: 'PUT',
      version: '2.0',
      data: request
    })
  }

  /**
   * Creates a local ingredient.
   *
   * @param request must implement CreateLocalFoodIngredientRequest
   * @return Promise<CreateLocalFoodIngredientResponse>
   */
  public createLocal(
    request: CreateLocalFoodIngredientRequest
  ): Promise<CreateLocalFoodIngredientResponse> {
    return this.apiService.request({
      endpoint: `/food/ingredient/local`,
      method: 'POST',
      version: '2.0',
      data: request
    })
  }

  /**
   * Updates a local ingredient.
   *
   * @param request must implement UpdateLocalFoodIngredientRequest
   * @return Promise<void>
   */
  public updateLocal(request: UpdateLocalFoodIngredientRequest): Promise<void> {
    return this.apiService.request({
      endpoint: `/food/ingredient/local/${request.id}`,
      method: 'PATCH',
      version: '2.0',
      data: request
    })
  }

  /**
   * Deletes a local ingredient. Can only succeed if the ingredient has no other relations.
   *
   * @param request must implement Entity
   * @return Promise<void>
   */
  public deleteLocal(request: Entity): Promise<void> {
    return this.apiService.request({
      endpoint: `/food/ingredient/local/${request.id}`,
      method: 'DELETE',
      version: '2.0'
    })
  }

  /**
   * Gets a remote ingredient.
   *
   * @param request must implement GetRemoteFoodIngredientRequest
   * @return Promise<GetRemoteFoodIngredientResponse>
   */
  public getRemote(
    request: GetRemoteFoodIngredientRequest
  ): Promise<GetRemoteFoodIngredientResponse> {
    return this.apiService.request({
      endpoint: `/food/ingredient/${request.id}`,
      method: 'GET',
      version: '2.0',
      data: request
    })
  }
}
