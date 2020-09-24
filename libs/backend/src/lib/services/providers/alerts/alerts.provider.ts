import { Injectable } from '@angular/core';
import { ApiService } from '../../api.service';

import {
  GetAllAlertsRequest,
  GetTypesAlertsRequest,
  ToggleGroupAlertsRequest,
  ToggleOneAlertsRequest
} from './requests';
import { GetAllAlertsResponse, GetTypesAlertsResponse } from './responses';

@Injectable({
  providedIn: 'root'
})
export class Alerts {
  public constructor(private readonly apiService: ApiService) {}

  /**
   * Fetches notifications based on specific filters.
   * Permissions: OrgAccess, OrgClientPHI
   *
   * @param request must implement GetAllAlertsRequest
   * @return Promise<GetAllAlertsResponse>
   */
  public getAll(request: GetAllAlertsRequest): Promise<GetAllAlertsResponse> {
    return this.apiService.request({
      endpoint: `/notification`,
      method: 'GET',
      version: '1.0',
      data: request
    });
  }

  /**
   * Toggles viewed status (seen/unseen) for a notification group.
   * Permissions: Provider
   *
   * @param request must implement ToggleGroupAlertsRequest
   * @return Promise<void>
   */
  public toggleGroup(request: ToggleGroupAlertsRequest): Promise<void> {
    return this.apiService.request({
      endpoint: `/notification/viewed/group/${request.groupId}`,
      method: 'PATCH',
      version: '1.0',
      data: request
    });
  }

  /**
   * Toggles viewed status (seen/unseen) for a notification and an account.
   * Permissions: OrgAccess, OrgClientPHI
   *
   * @param request must implement ToggleOneAlertsRequest
   * @return Promise<void>
   */
  public toggleOne(request: ToggleOneAlertsRequest): Promise<void> {
    return this.apiService.request({
      endpoint: `/notification/viewed/${request.notificationId}/${request.account}`,
      method: 'PATCH',
      version: '1.0',
      data: request
    });
  }

  /**
   * Retrieves available alert types as a paged collection.
   * Permissions: Admin, Provider, OrgAccess
   *
   * @param [request] must implement GetTypesAlertsRequest
   * @return Promise<GetTypesAlertsResponse>
   */
  public getTypes(request?: GetTypesAlertsRequest): Promise<GetTypesAlertsResponse> {
    return this.apiService.request({
      endpoint: `/warehouse/alert/type`,
      method: 'GET',
      version: '2.0',
      data: request
    });
  }
}
