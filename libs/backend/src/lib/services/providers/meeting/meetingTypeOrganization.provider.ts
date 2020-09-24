import { Injectable } from '@angular/core';
import { ApiService } from '../../api.service';

import {
  CreateMeetingTypeOrganizationRequest,
  DeleteMeetingTypeOrganizationRequest,
  GetAllMeetingTypeOrganizationRequest,
  UpdateMeetingTypeOrganizationRequest
} from './requests';
import { GetAllMeetingTypeOrganizationResponse } from './responses';

@Injectable({
  providedIn: 'root'
})
export class MeetingTypeOrganization {
  public constructor(private readonly apiService: ApiService) {}

  /**
   * Fetch meeting-types by organization.
   *
   * @param request must implement GetAllMeetingTypeOrganizationRequest
   * @return Promise<GetAllMeetingTypeOrganizationResponse>
   */
  public getAll(
    request: GetAllMeetingTypeOrganizationRequest
  ): Promise<GetAllMeetingTypeOrganizationResponse> {
    return this.apiService.request({
      endpoint: `/meeting/type/organization/${request.organization}`,
      method: 'GET',
      version: '2.0'
    });
  }

  /**
   * Associate meeting-type with organization.
   * Permissions: Admin, Provider, OrgAdmin
   *
   * @param request must implement CreateMeetingTypeOrganizationRequest
   * @return Promise<void>
   */
  public create(request: CreateMeetingTypeOrganizationRequest): Promise<void> {
    return this.apiService.request({
      endpoint: `/meeting/type/organization`,
      method: 'POST',
      version: '2.0',
      data: request
    });
  }

  /**
   * Associate meeting-type with organization.
   * Permissions: Admin, Provider, OrgAdmin
   *
   * @param request must implement UpdateMeetingTypeOrganizationRequest
   * @return Promise<void>
   */
  public update(request: UpdateMeetingTypeOrganizationRequest): Promise<void> {
    return this.apiService.request({
      endpoint: `/meeting/type/organization`,
      method: 'PUT',
      version: '2.0',
      data: request
    });
  }

  /**
   * Delete meeting-type association.
   * Permissions: Admin, Provider, OrgAdmin
   *
   * @param request must implement DeleteMeetingTypeOrganizationRequest
   * @return Promise<void>
   */
  public delete(request: DeleteMeetingTypeOrganizationRequest): Promise<void> {
    return this.apiService.request({
      endpoint: `/meeting/type/${request.typeId}/organization/${request.organization}`,
      method: 'DELETE',
      version: '2.0'
    });
  }
}
