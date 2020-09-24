import { Injectable } from '@angular/core';
import { ApiService } from '../../api.service';

import {
  DeleteFoodIngredientLocaleRequest,
  GetFoodIngredientLocaleRequest,
  UpdateFoodIngredientLocaleRequest
} from './requests';
import { GetFoodIngredientLocaleResponse } from './responses';

@Injectable({
  providedIn: 'root'
})
export class FoodIngredientLocale {
  public constructor(private readonly apiService: ApiService) {}

  /**
   * Get a translation for specific ingredient & locale.
   * Permissions: Admin
   *
   * @param request must implement GetFoodIngredientLocaleRequest
   * @return Promise<GetFoodIngredientLocaleResponse>
   */
  public get(request: GetFoodIngredientLocaleRequest): Promise<GetFoodIngredientLocaleResponse> {
    return this.apiService.request({
      endpoint: `/food/ingredient/local/${request.id}/locale/${request.locale}`,
      method: 'GET',
      version: '2.0'
    });
  }

  /**
   * Create a translation for specific ingredient & locale.
   * Permissions: Admin
   *
   * @param request must implement UpdateFoodIngredientLocaleRequest
   * @return Promise<void>
   */
  public update(request: UpdateFoodIngredientLocaleRequest): Promise<void> {
    return this.apiService.request({
      endpoint: `/food/ingredient/local/${request.id}/locale/${request.locale}`,
      method: 'PUT',
      version: '2.0',
      data: request
    });
  }

  /**
   * Deletes a translation for specific ingredient & locale.
   * Permissions: Admin
   *
   * @param request must implement DeleteFoodIngredientLocaleRequest
   * @return Promise<void>
   */
  public delete(request: DeleteFoodIngredientLocaleRequest): Promise<void> {
    return this.apiService.request({
      endpoint: `/food/ingredient/local/${request.id}/locale/${request.locale}`,
      method: 'DELETE',
      version: '2.0'
    });
  }
}
