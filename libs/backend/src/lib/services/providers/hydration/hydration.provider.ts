import { Injectable } from '@angular/core';
import { ApiService } from '../../api.service';

import { GetAllHydrationResponse } from '../../shared';
import {
  CreateHydrationRequest,
  DeleteHydrationRequest,
  GetAllHydrationRequest,
  GetSummaryHydrationRequest,
  UpdateHydrationRequest
} from './requests';
import { GetSummaryHydrationResponse } from './responses';

@Injectable({
  providedIn: 'root'
})
export class Hydration {
  public constructor(private readonly apiService: ApiService) {}

  /**
   * Create hydration entries for a user.
   * Permissions: OrgAccess, OrgClientPHI
   *
   * @param request must implement CreateHydrationRequest
   * @return Promise<void>
   */
  public create(request: CreateHydrationRequest): Promise<void> {
    return this.apiService.request({
      endpoint: `/hydration`,
      method: 'POST',
      version: '1.0',
      data: request
    });
  }

  /**
   * Edit hydration entry for a user.
   * Permissions: OrgAccess, OrgClientPHI
   *
   * @param request must implement UpdateHydrationRequest
   * @return Promise<void>
   */
  public update(request: UpdateHydrationRequest): Promise<void> {
    return this.apiService.request({
      endpoint: `/hydration`,
      method: 'PUT',
      version: '1.0',
      data: request
    });
  }

  /**
   * Delete hydration entry for a user.
   * Permissions: OrgAccess, OrgClientPHI
   *
   * @param request must implement DeleteHydrationRequest
   * @return Promise<void>
   */
  public delete(request: DeleteHydrationRequest): Promise<void> {
    return this.apiService.request({
      endpoint: `/hydration`,
      method: 'DELETE',
      version: '1.0',
      data: request
    });
  }

  /**
   * Get hydration entries for a user. Returned in paginated groups of 10.
   * Permissions: OrgAccess, OrgClientPHI
   *
   * @param [request] must implement GetAllHydrationRequest
   * @return Promise<GetAllHydrationResponse> An object of hydration arrays
   */
  public getAll(request?: GetAllHydrationRequest): Promise<GetAllHydrationResponse> {
    return this.apiService.request({
      endpoint: `/hydration`,
      method: 'GET',
      version: '1.0',
      data: request
    });
  }

  /**
   * Get hydration summary, in daily, weekly, or monthly average.
   * Permissions: OrgAccess, OrgClientPHI
   *
   * @param request must implement GetSummaryHydrationRequest
   * @return Promise<GetSummaryHydrationResponse>
   */
  public getSummary(request: GetSummaryHydrationRequest): Promise<GetSummaryHydrationResponse> {
    return this.apiService.request({
      endpoint: `/hydration/summary`,
      method: 'GET',
      version: '1.0',
      data: request
    });
  }
}
