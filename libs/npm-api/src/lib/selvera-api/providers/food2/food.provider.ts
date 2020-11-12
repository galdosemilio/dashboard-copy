import { ApiService } from '../../services/api.service'

import { GetAllFoodRequest } from './requests'
import { GetAllFoodResponse, GetRegionsFoodResponse } from './responses'

export class FoodV2 {
  public constructor(private readonly apiService: ApiService) {}

  /**
   * Fetch all food items from remote source.
   *
   * @param request must implement GetAllFoodRequest
   * @return Promise<GetAllFoodResponse>
   */
  public getAll(request: GetAllFoodRequest): Promise<GetAllFoodResponse> {
    return this.apiService.request({
      endpoint: `/food`,
      method: 'GET',
      version: '2.0',
      data: request
    })
  }

  /**
   * Fetch all regions that the remote food & ingredient lookup supports.
   *
   * @return Promise<GetRegionsFoodResponse>
   */
  public getRegions(): Promise<GetRegionsFoodResponse> {
    return this.apiService.request({
      endpoint: `/food/region`,
      method: 'GET',
      version: '2.0'
    })
  }
}
