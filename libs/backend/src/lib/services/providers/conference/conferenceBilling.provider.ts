import { Injectable } from '@angular/core';
import { ApiService } from '../../api.service';

import { GetSummaryConferenceBillingRequest } from './requests';
import { GetSummaryConferenceBillingResponse } from './responses';

@Injectable({
  providedIn: 'root'
})
export class ConferenceBilling {
  public constructor(private readonly apiService: ApiService) {}

  /**
   * Retrieves billing summary for an organization and its hierarchy.
   * Permissions: Admin, Provider, OrgAdmin
   *
   * @param request must implement GetSummaryConferenceBillingRequest
   * @return Promise<GetSummaryConferenceBillingResponse>
   */
  public getSummary(
    request: GetSummaryConferenceBillingRequest
  ): Promise<GetSummaryConferenceBillingResponse> {
    return this.apiService.request({
      endpoint: `/conference/billing`,
      method: 'POST',
      version: '1.0',
      data: request
    });
  }
}
