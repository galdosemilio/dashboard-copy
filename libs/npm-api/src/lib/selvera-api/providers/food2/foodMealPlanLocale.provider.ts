import { ApiService } from '../../services/api.service'

import {
  DeleteFoodMealPlanLocaleRequest,
  GetFoodMealPlanLocaleRequest,
  UpdateFoodMealPlanLocaleRequest
} from './requests'
import { GetFoodMealPlanLocaleResponse } from './responses'

export class FoodMealPlanLocale {
  public constructor(private readonly apiService: ApiService) {}

  /**
   * Get a translation for specific meal-plan & locale.
   * Permissions: Admin
   *
   * @param request must implement GetFoodMealPlanLocaleRequest
   * @return Promise<GetFoodMealPlanLocaleResponse>
   */
  public get(
    request: GetFoodMealPlanLocaleRequest
  ): Promise<GetFoodMealPlanLocaleResponse> {
    return this.apiService.request({
      endpoint: `/food/meal-plan/${request.id}/locale/${request.locale}`,
      method: 'GET',
      version: '1.0'
    })
  }

  /**
   * Create a translation for specific meal-plan & locale.
   * Permissions: Admin
   *
   * @param request must implement UpdateFoodMealPlanLocaleRequest
   * @return Promise<void>
   */
  public update(request: UpdateFoodMealPlanLocaleRequest): Promise<void> {
    return this.apiService.request({
      endpoint: `/food/meal-plan/${request.id}/locale/${request.locale}`,
      method: 'PUT',
      version: '1.0',
      data: request
    })
  }

  /**
   * Deletes a translation for specific meal-plan & locale.
   * Permissions: Admin
   *
   * @param request must implement DeleteFoodMealPlanLocaleRequest
   * @return Promise<void>
   */
  public delete(request: DeleteFoodMealPlanLocaleRequest): Promise<void> {
    return this.apiService.request({
      endpoint: `/food/meal-plan/${request.id}/locale/${request.locale}`,
      method: 'DELETE',
      version: '1.0'
    })
  }
}
