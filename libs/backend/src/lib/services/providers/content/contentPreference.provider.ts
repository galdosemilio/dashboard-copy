import { Injectable } from '@angular/core';
import { ApiService } from '../../api.service';

import { Entity } from '../../shared';
import { GetSingleContentPreferenceRequest, UpsertContentPreferenceRequest } from './requests';
import { ContentPreferenceSingle } from './responses';

@Injectable({
  providedIn: 'root'
})
export class ContentPreference {
  public constructor(private readonly apiService: ApiService) {}

  /**
   * Retrieves the most appropriate preference entry for specified hierarchy.
   * Permissions: Client, Provider, OrgAssociation
   *
   * @param request must implement GetSingleContentPreferenceRequest
   * @return Promise<ContentPreferenceSingle>
   */
  public getSingle(request: GetSingleContentPreferenceRequest): Promise<ContentPreferenceSingle> {
    return this.apiService.request({
      endpoint: `/content/preference`,
      method: 'GET',
      version: '1.0',
      data: request
    });
  }

  /**
   * Creates or updates a preference entry for a specified organization.
   * Permissions: Admin, Provider, OrgAdmin
   *
   * @param request must implement UpsertContentPreferenceRequest
   * @return Promise<void>
   */
  public upsert(request: UpsertContentPreferenceRequest): Promise<void> {
    return this.apiService.request({
      endpoint: `/content/preference/${request.organization}`,
      method: 'PUT',
      version: '1.0',
      data: request
    });
  }

  /**
   * Deletes a preference entry for a specified organization.
   * Permissions: Admin, Provider, OrgAdmin
   *
   * @param request must implement Entity
   * @return Promise<void>
   */
  public delete(request: Entity): Promise<void> {
    return this.apiService.request({
      endpoint: `/content/preference/${request.id}`,
      method: 'DELETE',
      version: '1.0'
    });
  }
}
