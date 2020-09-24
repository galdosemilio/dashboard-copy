import { Injectable } from '@angular/core';
import { ApiService } from '../../api.service';

import {
  DeleteFoodServingLocaleRequest,
  GetFoodServingLocaleRequest,
  UpdateFoodServingLocaleRequest
} from './requests';
import { GetFoodServingLocaleResponse } from './responses';

@Injectable({
  providedIn: 'root'
})
export class FoodServingLocale {
  public constructor(private readonly apiService: ApiService) {}

  /**
   * Get a translation for specific serving & locale.
   * Permissions: Admin
   *
   * @param request must implement GetFoodServingLocaleRequest
   * @return Promise<GetFoodServingLocaleResponse>
   */
  public get(request: GetFoodServingLocaleRequest): Promise<GetFoodServingLocaleResponse> {
    return this.apiService.request({
      endpoint: `/food/serving/${request.id}/locale/${request.locale}`,
      method: 'GET',
      version: '1.0'
    });
  }

  /**
   * Create a translation for specific serving & locale.
   * Permissions: Admin
   *
   * @param request must implement UpdateFoodServingLocaleRequest
   * @return Promise<void>
   */
  public update(request: UpdateFoodServingLocaleRequest): Promise<void> {
    return this.apiService.request({
      endpoint: `/food/serving/${request.id}/locale/${request.locale}`,
      method: 'PUT',
      version: '1.0',
      data: request
    });
  }

  /**
   * Deletes a translation for specific serving & locale.
   * Permissions: Admin
   *
   * @param request must implement DeleteFoodServingLocaleRequest
   * @return Promise<void>
   */
  public delete(request: DeleteFoodServingLocaleRequest): Promise<void> {
    return this.apiService.request({
      endpoint: `/food/serving/${request.id}/locale/${request.locale}`,
      method: 'DELETE',
      version: '1.0'
    });
  }
}
