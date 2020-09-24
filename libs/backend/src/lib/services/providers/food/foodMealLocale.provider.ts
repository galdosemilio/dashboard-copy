import { Injectable } from '@angular/core';
import { ApiService } from '../../api.service';

import {
  DeleteFoodMealLocaleRequest,
  GetFoodMealLocaleRequest,
  UpdateFoodMealLocaleRequest
} from './requests';
import { GetFoodMealLocaleResponse } from './responses';

@Injectable({
  providedIn: 'root'
})
export class FoodMealLocale {
  public constructor(private readonly apiService: ApiService) {}

  /**
   * Get a translation for specific meal & locale.
   * Permissions: Admin
   *
   * @param request must implement GetFoodMealLocaleRequest
   * @return Promise<GetFoodMealLocaleResponse>
   */
  public get(request: GetFoodMealLocaleRequest): Promise<GetFoodMealLocaleResponse> {
    return this.apiService.request({
      endpoint: `/food/meal/${request.id}/locale/${request.locale}`,
      method: 'GET',
      version: '2.0'
    });
  }

  /**
   * Create a translation for specific meal & locale.
   * Permissions: Admin
   *
   * @param request must implement UpdateFoodMealLocaleRequest
   * @return Promise<void>
   */
  public update(request: UpdateFoodMealLocaleRequest): Promise<void> {
    return this.apiService.request({
      endpoint: `/food/meal/${request.id}/locale/${request.locale}`,
      method: 'PUT',
      version: '2.0',
      data: request
    });
  }

  /**
   * Deletes a translation for specific meal & locale.
   * Permissions: Admin
   *
   * @param request must implement DeleteFoodMealLocaleRequest
   * @return Promise<void>
   */
  public delete(request: DeleteFoodMealLocaleRequest): Promise<void> {
    return this.apiService.request({
      endpoint: `/food/meal/${request.id}/locale/${request.locale}`,
      method: 'DELETE',
      version: '2.0'
    });
  }
}
