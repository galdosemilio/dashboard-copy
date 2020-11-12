import { ApiService } from '../../services/api.service'

import { Entity } from '../common/entities'
import {
  CreateFoodFavoriteRequest,
  GetAllFoodFavoriteRequest
} from './requests'
import { FoodFavoriteSingle, GetAllFoodFavoriteResponse } from './responses'

export class FoodFavorite {
  public constructor(private readonly apiService: ApiService) {}

  /**
   * Fetch Favorite Meal. Clients account is added automatically. Providers can only fetch favorite meals for their own clients.
   * Permissions: Provider, Client, OrgAccess, OrgClientPHI
   *
   * @param [request] must implement GetAllFoodFavoriteRequest
   * @return Promise<GetAllFoodFavoriteResponse>
   */
  public getAll(
    request?: GetAllFoodFavoriteRequest
  ): Promise<GetAllFoodFavoriteResponse> {
    return this.apiService.request({
      endpoint: `/food/favorite`,
      method: 'GET',
      version: '2.0',
      data: request
    })
  }

  /**
   * Fetch single favorite meal.
   * Permissions: Provider, Client, OrgAccess, OrgClientPHI
   *
   * @param request must implement Entity
   * @return Promise<FoodFavoriteSingle>
   */
  public getSingle(request: Entity): Promise<FoodFavoriteSingle> {
    return this.apiService.request({
      endpoint: `/food/favorite/${request.id}`,
      method: 'GET',
      version: '2.0'
    })
  }

  /**
   * Add Favorite Meal. Clients account is added automatically. Providers can only add favorite meals for their own clients.
   * Permissions: Provider, Client, OrgAccess, OrgClientPHI
   *
   * @param request must implement CreateFoodFavoriteRequest
   * @return Promise<void>
   */
  public create(request: CreateFoodFavoriteRequest): Promise<void> {
    return this.apiService.request({
      endpoint: `/food/favorite`,
      method: 'POST',
      version: '2.0',
      data: request
    })
  }

  /**
   * Delete Favorite Meal. Providers can only delete favorite meals for their own clients.
   * Permissions: Provider, Client, OrgAccess, OrgClientPHI
   *
   * @param request must implement Entity
   * @return Promise<void>
   */
  public delete(request: Entity): Promise<void> {
    return this.apiService.request({
      endpoint: `/food/favorite/${request.id}`,
      method: 'DELETE',
      version: '2.0'
    })
  }
}
