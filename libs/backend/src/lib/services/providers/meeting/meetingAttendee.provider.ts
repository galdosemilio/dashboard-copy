import { Injectable } from '@angular/core';
import { ApiService } from '../../api.service';

import {
  AddMeetingAttendeeRequest,
  DeleteRecurringMeetingAttendeeRequest,
  DeleteSingleMeetingAttendeeRequest,
  UpdateMeetingAttendeeRequest
} from './requests';

@Injectable({
  providedIn: 'root'
})
export class MeetingAttendee {
  public constructor(private readonly apiService: ApiService) {}

  /**
   * Add attendee to meeting.
   * Permissions: OrgAccess
   *
   * @param request must implement AddMeetingAttendeeRequest
   * @return Promise<void>
   */
  public add(request: AddMeetingAttendeeRequest): Promise<void> {
    return this.apiService.request({
      endpoint: `/meeting/attendee`,
      method: 'POST',
      version: '2.0',
      data: request
    });
  }

  /**
   * Set attendance status for a specific account and meeting.
   * Permissions: Provider, Client, OrgAccess, OrgClientPHI
   *
   * @param request must implement UpdateMeetingAttendeeRequest
   * @return Promise<void>
   */
  public update(request: UpdateMeetingAttendeeRequest): Promise<void> {
    return this.apiService.request({
      endpoint: `/attendance`,
      method: 'PUT',
      version: '2.0',
      data: request
    });
  }

  /**
   * Delete an attendee from a single meeting.
   * Permissions: OrgAccess, OrgClientPHI
   *
   * @param request must implement DeleteSingleMeetingAttendeeRequest
   * @return Promise<void>
   */
  public deleteSingle(request: DeleteSingleMeetingAttendeeRequest): Promise<void> {
    return this.apiService.request({
      endpoint: `/meeting/${request.meetingId}/attendee/${request.account}`,
      method: 'DELETE',
      version: '2.0'
    });
  }

  /**
   * Delete an attendee from a recurring meeting.
   * Permissions: OrgAccess, OrgClientPHI
   *
   * @param request must implement DeleteRecurringMeetingAttendeeRequest
   * @return Promise<void>
   */
  public deleteRecurring(request: DeleteRecurringMeetingAttendeeRequest): Promise<void> {
    return this.apiService.request({
      endpoint: `/meeting/${request.meetingId}/attendee/${request.account}/recurring`,
      method: 'DELETE',
      version: '2.0'
    });
  }
}
