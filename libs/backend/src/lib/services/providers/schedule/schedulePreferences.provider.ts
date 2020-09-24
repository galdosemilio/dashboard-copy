import { Injectable } from '@angular/core';
import { ApiService } from '../../api.service';

import { Entity } from '../../shared';
import { UpdateSchedulePreferencesRequest } from './requests';
import { SchedulePreferencesSingle } from './responses';

@Injectable({
  providedIn: 'root'
})
export class SchedulePreferences {
  public constructor(private readonly apiService: ApiService) {}

  /**
   * Get preferences for an organization.
   * Admins and manages may access to any organization,
   * clients and providers - only to the organization with which they are associated.
   *
   * @param request must implement Entity
   * @return Promise<SchedulePreferencesSingle>
   */
  public getSingle(request: Entity): Promise<SchedulePreferencesSingle> {
    return this.apiService.request({
      endpoint: `/schedule/preferences/${request.id}`,
      method: 'GET',
      version: '3.0'
    });
  }

  /**
   * Set preference entry for an organization. Accessible only for admins.
   * Permissions: Admin
   *
   * @param request must implement UpdateSchedulePreferencesRequest
   * @return Promise<void>
   */
  public update(request: UpdateSchedulePreferencesRequest): Promise<void> {
    return this.apiService.request({
      endpoint: `/schedule/preferences/${request.id}`,
      method: 'PUT',
      version: '3.0',
      data: request
    });
  }

  /**
   * Delete preferences entry for an organization. Accessible only for admins.
   * Permissions: Admin
   *
   * @param request must implement Entity
   * @return Promise<void>
   */
  public delete(request: Entity): Promise<void> {
    return this.apiService.request({
      endpoint: `/schedule/preferences/${request.id}`,
      method: 'DELETE',
      version: '3.0'
    });
  }
}
