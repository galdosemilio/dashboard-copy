import { ApiService } from '../../services/api.service'

import {
  DeleteFoodMealPlanTypeLocaleRequest,
  GetFoodMealPlanTypeLocaleRequest,
  UpdateFoodMealPlanTypeLocaleRequest
} from './requests'
import { GetFoodMealPlanTypeLocaleResponse } from './responses'

export class FoodMealPlanTypeLocale {
  public constructor(private readonly apiService: ApiService) {}

  /**
   * Get a translation for specific meal-plan type & locale.
   * Permissions: Admin
   *
   * @param request must implement GetFoodMealPlanTypeLocaleRequest
   * @return Promise<GetFoodMealPlanTypeLocaleResponse>
   */
  public get(
    request: GetFoodMealPlanTypeLocaleRequest
  ): Promise<GetFoodMealPlanTypeLocaleResponse> {
    return this.apiService.request({
      endpoint: `/food/meal-plan/type/${request.id}/locale/${request.locale}`,
      method: 'GET',
      version: '1.0'
    })
  }

  /**
   * Create a translation for specific meal-plan type & locale.
   * Permissions: Admin
   *
   * @param request must implement UpdateFoodMealPlanTypeLocaleRequest
   * @return Promise<void>
   */
  public update(request: UpdateFoodMealPlanTypeLocaleRequest): Promise<void> {
    return this.apiService.request({
      endpoint: `/food/meal-plan/type/${request.id}/locale/${request.locale}`,
      method: 'PUT',
      version: '1.0',
      data: request
    })
  }

  /**
   * Deletes a translation for specific meal-plan type & locale.
   * Permissions: Admin
   *
   * @param request must implement DeleteFoodMealPlanTypeLocaleRequest
   * @return Promise<void>
   */
  public delete(request: DeleteFoodMealPlanTypeLocaleRequest): Promise<void> {
    return this.apiService.request({
      endpoint: `/food/meal-plan/type/${request.id}/locale/${request.locale}`,
      method: 'DELETE',
      version: '1.0'
    })
  }
}
