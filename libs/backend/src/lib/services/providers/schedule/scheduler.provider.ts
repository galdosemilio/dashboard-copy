import { Injectable } from '@angular/core';
import { ApiService } from '../../api.service';

import {
  GetOpenTimeslotsQuickSchedulerRequest,
  GetOpenTimeslotsSchedulerRequest,
  GetSummarySchedulerRequest
} from './requests';
import {
  GetOpenTimeslotsQuickSchedulerResponse,
  GetOpenTimeslotsSchedulerResponse,
  GetSummarySchedulerResponse
} from './responses';

@Injectable({
  providedIn: 'root'
})
export class Scheduler {
  public constructor(private readonly apiService: ApiService) {}

  /**
   * Fetch a list of open timeslots for a user, up to 7 days.
   * Permissions: OrgAccess, OrgClientPHI
   *
   * @param request must implement GetOpenTimeslotsSchedulerRequest
   * @return Promise<GetOpenTimeslotsSchedulerResponse>
   */
  public getOpenTimeslots(
    request: GetOpenTimeslotsSchedulerRequest
  ): Promise<GetOpenTimeslotsSchedulerResponse> {
    return this.apiService.request({
      endpoint: `/scheduler`,
      method: 'GET',
      version: '2.0',
      data: request
    });
  }

  /**
   * Fetch a list of open timeslots for a provider in a currently-scheduled meeting, up to 7 days.
   * This endpoint is intended for quick meeting reschedule via an email reminder link.
   * It doesn't require authentication but validates the URL token.
   *
   * @param request must implement GetOpenTimeslotsQuickSchedulerRequest
   * @return Promise<GetOpenTimeslotsQuickSchedulerResponse>
   */
  public getOpenTimeslotsQuick(
    request: GetOpenTimeslotsQuickSchedulerRequest
  ): Promise<GetOpenTimeslotsQuickSchedulerResponse> {
    return this.apiService.request({
      endpoint: `/scheduler/quick`,
      method: 'GET',
      version: '2.0',
      data: request
    });
  }

  /**
   * Fetch a summary of all minutes used or booked to be used, and lifetime number of booked sessions.
   * Meetings that are attended by this individual with attendance not set or listed to TRUE will be included in the calculation.
   * Permissions: OrgAccess
   *
   * @param request must implement GetSummarySchedulerRequest
   * @return Promise<GetSummarySchedulerResponse>
   */
  public getSummary(request: GetSummarySchedulerRequest): Promise<GetSummarySchedulerResponse> {
    return this.apiService.request({
      endpoint: `/schedule/summary`,
      method: 'GET',
      version: '2.0',
      data: request
    });
  }
}
