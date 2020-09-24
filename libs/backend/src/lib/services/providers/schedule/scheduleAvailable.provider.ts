import { Injectable } from '@angular/core';
import { ApiService } from '../../api.service';

import { Entity } from '../../shared';
import {
  CreateRecurrentScheduleAvailableRequest,
  CreateSingleScheduleAvailableRequest,
  GetAllScheduleAvailableRequest,
  GetCalendarScheduleAvailableRequest,
  GetProvidersScheduleAvailableRequest,
  SetTimezoneScheduleAvailableRequest
} from './requests';
import {
  GetAllScheduleAvailableResponse,
  GetCalendarScheduleAvailableResponse,
  GetProvidersScheduleAvailableResponse,
  ScheduleAvailableSingle
} from './responses';

@Injectable({
  providedIn: 'root'
})
export class ScheduleAvailable {
  public constructor(private readonly apiService: ApiService) {}

  /**
   * Fetch all availability records for a single user.
   * Permissions: Admin, Provider
   *
   * @param [request] must implement GetAllScheduleAvailableRequest
   * @return Promise<GetAllScheduleAvailableResponse>
   */
  public getAll(
    request?: GetAllScheduleAvailableRequest
  ): Promise<GetAllScheduleAvailableResponse> {
    return this.apiService.request({
      endpoint: `/available`,
      method: 'GET',
      version: '2.0',
      data: request
    });
  }

  /**
   * Fetch account from list which best matches availability preference.
   * Permissions: Admin, Provider
   *
   * @param request must implement GetProvidersScheduleAvailableRequest
   * @return Promise<GetProvidersScheduleAvailableResponse>
   */
  public getProviders(
    request: GetProvidersScheduleAvailableRequest
  ): Promise<GetProvidersScheduleAvailableResponse> {
    return this.apiService.request({
      endpoint: `/available/match`,
      method: 'GET',
      version: '2.0',
      data: request
    });
  }

  /**
   * Fetch availability calendar entries in a given date range for an account.
   * Permissions: Admin, Provider
   *
   * @param [request] must implement GetCalendarScheduleAvailableRequest
   * @return Promise<GetCalendarScheduleAvailableResponse>
   */
  public getCalendar(
    request?: GetCalendarScheduleAvailableRequest
  ): Promise<GetCalendarScheduleAvailableResponse> {
    return this.apiService.request({
      endpoint: `/available/calendar`,
      method: 'GET',
      version: '2.0',
      data: request
    });
  }

  /**
   * Fetch single availability record.
   * Permissions: Admin, Provider
   *
   * @param request must implement Entity
   * @return Promise<ScheduleAvailableSingle>
   */
  public getSingle(request: Entity): Promise<ScheduleAvailableSingle> {
    return this.apiService.request({
      endpoint: `/available/${request.id}`,
      method: 'GET',
      version: '2.0'
    });
  }

  /**
   * Add availability record.
   * Permissions: Admin, Provider
   *
   * @param request must implement CreateRecurrentScheduleAvailableRequest
   * @return Promise<Entity> The id of the newly-created record
   */
  public createRecurrent(request: CreateRecurrentScheduleAvailableRequest): Promise<Entity> {
    return this.apiService
      .request({
        endpoint: `/available`,
        method: 'POST',
        version: '2.0',
        data: request
      })
      .then(res => ({ id: res.availableId.toString() }));
  }

  /**
   * Add single availability record.
   * Permissions: Admin, Provider
   *
   * @param request must implement CreateSingleScheduleAvailableRequest
   * @return Promise<Entity>
   */
  public createSingle(request: CreateSingleScheduleAvailableRequest): Promise<Entity> {
    return this.apiService.request({
      endpoint: `/available/single`,
      method: 'POST',
      version: '2.0',
      data: request
    });
  }

  /**
   * Set the timezone for specific accounts.  The timezone must be a valid postgres name, such as 'America/New_York'.
   * Permissions: Admin, Provider
   *
   * @param request must implement SetTimezoneScheduleAvailableRequest
   * @return Promise<void>
   */
  public setTimezone(request: SetTimezoneScheduleAvailableRequest): Promise<void> {
    return this.apiService.request({
      endpoint: `/available/timezone`,
      method: 'POST',
      version: '2.0',
      data: request
    });
  }

  /**
   * Delete single availability calendar entry for a user.
   * Permissions: Admin, Provider
   *
   * @param request must implement Entity
   * @return Promise<void>
   */
  public deleteSingle(request: Entity): Promise<void> {
    return this.apiService.request({
      endpoint: `/available/single/${request.id}`,
      method: 'DELETE',
      version: '2.0'
    });
  }

  /**
   * Delete all availability for a user.
   * Permissions: Admin, Provider
   *
   * @param request must implement Entity
   * @return Promise<void>
   */
  public deleteAll(request: Entity): Promise<void> {
    return this.apiService.request({
      endpoint: `/available/account/${request.id}`,
      method: 'DELETE',
      version: '2.0'
    });
  }

  /**
   * Delete recurrent availability.
   * Permissions: Admin, Provider
   *
   * @param request must implement Entity
   * @return Promise<void>
   */
  public deleteRecurrent(request: Entity): Promise<void> {
    return this.apiService.request({
      endpoint: `/available/${request.id}`,
      method: 'DELETE',
      version: '2.0'
    });
  }
}
