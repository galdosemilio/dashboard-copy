import { ApiService } from '../../services/api.service'

import {
  CreateFoodPreferenceRequest,
  DeleteFoodPreferenceRequest,
  GetAllFoodPreferenceRequest,
  UpdateFoodPreferenceRequest
} from './requests'
import { GetAllFoodPreferenceResponse } from './responses'

export class FoodPreference {
  public constructor(private readonly apiService: ApiService) {}

  /**
   * Get food tracking preference of organization.
   *
   * @param request must implement GetAllFoodPreferenceRequest
   * @return Promise<GetAllFoodPreferenceResponse>
   */
  public getAll(
    request: GetAllFoodPreferenceRequest
  ): Promise<GetAllFoodPreferenceResponse> {
    return this.apiService.request({
      endpoint: `/food/preference`,
      method: 'GET',
      version: '1.0',
      data: request
    })
  }

  /**
   * Add food tracking preference of organization.
   * Permissions: Admin, Provider, OrgAdmin
   *
   * @param request must implement CreateFoodPreferenceRequest
   * @return Promise<void>
   */
  public create(request: CreateFoodPreferenceRequest): Promise<void> {
    return this.apiService.request({
      endpoint: `/food/preference`,
      method: 'POST',
      version: '1.0',
      data: request
    })
  }

  /**
   * Update food tracking preference of organization.
   * Permissions: Admin, Provider, OrgAdmin
   *
   * @param request must implement UpdateFoodPreferenceRequest
   * @return Promise<void>
   */
  public update(request: UpdateFoodPreferenceRequest): Promise<void> {
    return this.apiService.request({
      endpoint: `/food/preference`,
      method: 'PATCH',
      version: '1.0',
      data: request
    })
  }

  /**
   * Delete food tracking preference of organization.
   * Permissions: Admin, Provider, OrgAdmin
   *
   * @param request must implement DeleteFoodPreferenceRequest
   * @return Promise<void>
   */
  public delete(request: DeleteFoodPreferenceRequest): Promise<void> {
    return this.apiService.request({
      endpoint: `/food/preference`,
      method: 'DELETE',
      version: '1.0',
      data: request
    })
  }
}
