import { Injectable } from '@angular/core';
import { ApiService } from '../../api.service';

import {
  DeleteAlertsPreferenceAccountRequest,
  UpsertAlertsPreferenceAccountRequest
} from './requests';

@Injectable({
  providedIn: 'root'
})
export class AlertsPreferenceAccount {
  public constructor(private readonly apiService: ApiService) {}

  /**
   * Creates or updates an account-level preference override for an account for an existing preference.
   * Permissions: Admin, Provider, OrgAdmin, OrgAccess
   *
   * @param request must implement UpsertAlertsPreferenceAccountRequest
   * @return Promise<void>
   */
  public upsert(request: UpsertAlertsPreferenceAccountRequest): Promise<void> {
    return this.apiService.request({
      endpoint: `/warehouse/alert/preference/${request.id}/account`,
      method: 'PUT',
      version: '2.0',
      data: request
    });
  }

  /**
   * Deletes an account-level preference override for an account for an existing preference.
   * Permissions: Admin, Provider, OrgAdmin, OrgAccess
   *
   * @param request must implement DeleteAlertsPreferenceAccountRequest
   * @return Promise<void>
   */
  public delete(request: DeleteAlertsPreferenceAccountRequest): Promise<void> {
    return this.apiService.request({
      endpoint: `/warehouse/alert/preference/${request.id}/account/${request.account}`,
      method: 'DELETE',
      version: '2.0'
    });
  }
}
