import { Injectable } from '@angular/core';
import { ApiService } from '../../api.service';

import { GetSummaryNutritionRequest } from './requests';
import { GetSummaryNutritionResponse } from './responses';

@Injectable({
  providedIn: 'root'
})
export class Nutrition {
  public constructor(private readonly apiService: ApiService) {}

  /**
   * Retrieves a consumption summary for a given account and date range.
   * Permissions: Admin, Provider, OrgAccess, OrgClientPHI
   *
   * @param request must implement GetSummaryNutritionRequest
   * @return Promise<GetSummaryNutritionResponse>
   */
  public getSummary(request: GetSummaryNutritionRequest): Promise<GetSummaryNutritionResponse> {
    return this.apiService.request({
      endpoint: `/nutrition/summary`,
      method: 'GET',
      version: '2.0',
      data: request
    });
  }
}
