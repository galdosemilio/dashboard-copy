import { Injectable } from '@angular/core';
import { ApiService } from '../../api.service';

import { Entity } from '../../shared';
import {
  CreateMeetingRequest,
  DeleteQuickMeetingRequest,
  GetAllMeetingRequest,
  UpdateMeetingRequest
} from './requests';
import { GetAllMeetingResponse, MeetingSingle } from './responses';

@Injectable({
  providedIn: 'root'
})
export class Meeting {
  public constructor(private readonly apiService: ApiService) {}

  /**
   * Fetch a list of all meetings, up to 50 paginated entries.
   *
   * @param [request] must implement GetAllMeetingRequest
   * @return Promise<GetAllMeetingResponse>
   */
  public getAll(request?: GetAllMeetingRequest): Promise<GetAllMeetingResponse> {
    return this.apiService.request({
      endpoint: `/meeting`,
      method: 'GET',
      version: '2.0',
      data: request
    });
  }

  /**
   * Fetch single meeting.
   *
   * @param request must implement Entity
   * @return Promise<MeetingSingle>
   */
  public getSingle(request: Entity): Promise<MeetingSingle> {
    return this.apiService.request({
      endpoint: `/meeting/${request.id}`,
      method: 'GET',
      version: '2.0'
    });
  }

  /**
   * Add meeting.
   *
   * @param request must implement CreateMeetingRequest
   * @return Promise<Entity> ID of the created meeting
   */
  public create(request: CreateMeetingRequest): Promise<Entity> {
    return this.apiService
      .request({
        endpoint: `/meeting`,
        method: 'POST',
        version: '2.0',
        data: request
      })
      .then(res => ({ id: res.meetingId.toString() }));
  }

  /**
   * Updating an existing details to an existing meeting.
   * Permissions: Admin, Provider, OrgAccess, OrgClientPHI
   *
   * @param request must implement UpdateMeetingRequest
   * @return Promise<void>
   */
  public update(request: UpdateMeetingRequest): Promise<void> {
    return this.apiService.request({
      endpoint: `/meeting/${request.id}`,
      method: 'PUT',
      version: '2.0',
      data: request
    });
  }

  /**
   * Delete an existing meeting and remove all attendees from that record.
   *
   * @param request must implement Entity
   * @return Promise<void>
   */
  public deleteSingle(request: Entity): Promise<void> {
    return this.apiService.request({
      endpoint: `/meeting/single/${request.id}`,
      method: 'DELETE',
      version: '2.0'
    });
  }

  /**
   * Delete an existing meeting if 1on1 or remove account from circle meeting.
   * This endpoint is intended for quick meeting cancelation via an email reminder link.
   * Permissions: Public
   *
   * @param request must implement DeleteQuickMeetingRequest
   * @return Promise<void>
   */
  public deleteQuick(request: DeleteQuickMeetingRequest): Promise<void> {
    return this.apiService.request({
      endpoint: `/meeting/quick/${request.token}`,
      method: 'DELETE',
      version: '2.0'
    });
  }

  /**
   * Delete an existing recurring series based on the meeting from the series.
   * Permissions: Admin, Provider, OrgAccess, OrgClientPHI
   *
   * @param request must implement Entity
   * @return Promise<void>
   */
  public deleteRecurring(request: Entity): Promise<void> {
    return this.apiService.request({
      endpoint: `/meeting/recurring/${request.id}`,
      method: 'DELETE',
      version: '2.0'
    });
  }
}
