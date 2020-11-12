import { ApiService } from '../../services/api.service'

import {
  DeleteFoodMealServingRequest,
  GetSingleFoodMealServingRequest,
  UpsertFoodMealServingRequest
} from './requests'
import { FoodMealServingSingle } from './responses'

export class FoodMealServing {
  public constructor(private readonly apiService: ApiService) {}

  /**
   * Associate meal with serving. Client can associate only own meals with own servings (related with own ingredients)
   * Provider can associate accessible client's meals and servings but only meals and servings of the same client.
   * Administrator can associate public or any client's meals and servings.
   *
   * @param request must implement UpsertFoodMealServingRequest
   * @return Promise<void>
   */
  public upsert(request: UpsertFoodMealServingRequest): Promise<void> {
    return this.apiService.request({
      endpoint: `/food/meal/${request.meal}/serving/${request.serving}`,
      method: 'PUT',
      version: '2.0',
      data: request
    })
  }

  /**
   * Fetch single meal-serving association.
   * Client can fetch only own meals and own servings.
   * (own ingredients) Provider can fetch accessible client's meals and servings.
   * Administrator can fetch public or any client's meals and servings.
   *
   * @param request must implement GetSingleFoodMealServingRequest
   * @return Promise<FoodMealServingSingle>
   */
  public getSingle(
    request: GetSingleFoodMealServingRequest
  ): Promise<FoodMealServingSingle> {
    return this.apiService.request({
      endpoint: `/food/meal/${request.meal}/serving/${request.serving}`,
      method: 'GET',
      version: '2.0'
    })
  }

  /**
   * Delete meal-serving association. Client can delete only own meals and own servings (own ingredients) associations.
   * Provider can delete accessible client's meals and servings associations.
   * Administrator can delete public or any client's meals and servings associations.
   *
   * @param request must implement DeleteFoodMealServingRequest
   * @return Promise<void>
   */
  public delete(request: DeleteFoodMealServingRequest): Promise<void> {
    return this.apiService.request({
      endpoint: `/food/meal/${request.meal}/serving/${request.serving}`,
      method: 'DELETE',
      version: '2.0'
    })
  }
}
