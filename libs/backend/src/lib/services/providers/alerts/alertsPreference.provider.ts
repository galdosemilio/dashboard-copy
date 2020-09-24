import { Injectable } from '@angular/core';
import { ApiService } from '../../api.service';

import { Entity } from '../../shared';
import {
  CreateAlertsPreferenceRequest,
  GetAllAlertsPreferenceRequest,
  UpdateAlertsPreferenceRequest
} from './requests';
import { GetAllAlertsPreferenceResponse } from './responses';

@Injectable({
  providedIn: 'root'
})
export class AlertsPreference {
  public constructor(private readonly apiService: ApiService) {}

  /**
   * Retrieves available alert preferences as a paged collection.
   * Permissions: Admin, Provider, OrgAccess
   *
   * @param request must implement GetAllAlertsPreferenceRequest
   * @return Promise<GetAllAlertsPreferenceResponse>
   */
  public getAll(request: GetAllAlertsPreferenceRequest): Promise<GetAllAlertsPreferenceResponse> {
    return this.apiService.request({
      endpoint: `/warehouse/alert/preference`,
      method: 'GET',
      version: '2.0',
      data: request
    });
  }

  /**
   * Creates alert preference for an organization and specified alert type.
   * Permissions: Admin, Provider, OrgAdmin, OrgAccess
   *
   * @param request must implement CreateAlertsPreferenceRequest
   * @return Promise<Entity>
   */
  public create(request: CreateAlertsPreferenceRequest): Promise<Entity> {
    return this.apiService.request({
      endpoint: `/warehouse/alert/preference`,
      method: 'POST',
      version: '2.0',
      data: request
    });
  }

  /**
   * Updates alert preference for an organization and specified alert type.
   * Permissions: Admin, Provider, OrgAdmin, OrgAccess
   *
   * @param request must implement UpdateAlertsPreferenceRequest
   * @return Promise<void>
   */
  public update(request: UpdateAlertsPreferenceRequest): Promise<void> {
    return this.apiService.request({
      endpoint: `/warehouse/alert/preference/${request.id}`,
      method: 'PATCH',
      version: '2.0',
      data: request
    });
  }

  /**
   * Deletes alert preference for an organization and specified alert type.
   * Permissions: Admin, Provider, OrgAdmin, OrgAccess
   *
   * @param request must implement Entity
   * @return Promise<void>
   */
  public delete(request: Entity): Promise<void> {
    return this.apiService.request({
      endpoint: `/warehouse/alert/preference/${request.id}`,
      method: 'DELETE',
      version: '2.0'
    });
  }
}
