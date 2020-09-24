import { Injectable } from '@angular/core';
import { ApiService } from '../../api.service';

import {
  AddDetailedMeasurementActivityRequest,
  AddMeasurementActivityRequest,
  DeleteMeasurementActivityRequest,
  GetAllMeasurementActivityRequest,
  GetDetailedMeasurementActivityRequest,
  GetHistoryMeasurementActivityRequest,
  GetSummaryMeasurementActivityRequest
} from './requests';
import {
  GetAllMeasurementActivityResponse,
  GetDetailedMeasurementActivityResponse,
  GetHistoryMeasurementActivityResponse,
  GetSummaryMeasurementActivityResponse
} from './responses';

@Injectable({
  providedIn: 'root'
})
export class MeasurementActivity {
  public constructor(private readonly apiService: ApiService) {}

  /**
   * Fetch activity summary.
   * Permissions: Provider, Client, OrgAccess, OrgClientPHI
   *
   * @param request must implement GetSummaryMeasurementActivityRequest
   * @return Promise<GetSummaryMeasurementActivityResponse>
   */
  public getSummary(
    request: GetSummaryMeasurementActivityRequest
  ): Promise<GetSummaryMeasurementActivityResponse> {
    return this.apiService.request({
      endpoint: `/measurement/activity/summary`,
      method: 'GET',
      version: '2.0',
      data: request
    });
  }

  /**
   * Fetch activity history.
   * Permissions: Provider, Client, OrgAccess, OrgClientPHI
   *
   * @param request must implement GetHistoryMeasurementActivityRequest
   * @return Promise<GetHistoryMeasurementActivityResponse>
   */
  public getHistory(
    request: GetHistoryMeasurementActivityRequest
  ): Promise<GetHistoryMeasurementActivityResponse> {
    return this.apiService.request({
      endpoint: `/measurement/activity/history`,
      method: 'GET',
      version: '1.0',
      data: request
    });
  }

  /**
   * Get activity measurements for a all users or a single user, during a defined date range.
   * If no date range is provided (start_date and end_date) results for the current day will be returned.
   * Permissions: Provider, Client, OrgAccess, OrgClientPHI
   *
   * @param request must implement GetAllMeasurementActivityRequest
   * @return Promise<GetAllMeasurementActivityResponse>
   */
  public getAll(
    request: GetAllMeasurementActivityRequest
  ): Promise<GetAllMeasurementActivityResponse> {
    return this.apiService.request({
      endpoint: `/measurement/activity`,
      method: 'GET',
      version: '1.0',
      data: request
    });
  }

  /**
   * Get detailed measurements for a single user, during a defined date range.
   * If no date range is provided results for the current day will be returned.
   * Permissions: Provider, Client, OrgAccess, OrgClientPHI
   *
   * @param request must implement GetDetailedMeasurementActivityRequest
   * @return Promise<GetDetailedMeasurementActivityResponse>
   */
  public getDetailed(
    request: GetDetailedMeasurementActivityRequest
  ): Promise<GetDetailedMeasurementActivityResponse> {
    return this.apiService.request({
      endpoint: `/measurement/activity/detailed`,
      method: 'GET',
      version: '1.0',
      data: request
    });
  }

  /**
   * Add activity measurement(s) for a single user. You may add data for up to 15 days at a time.
   * Existing activity measurements in the database will be deleted and overwritten by any passed data.
   * Permissions: Provider, Client, OrgAccess, OrgClientPHI
   *
   * @param request must implement AddMeasurementActivityRequest
   * @return Promise<void>
   */
  public add(request: AddMeasurementActivityRequest): Promise<void> {
    return this.apiService.request({
      endpoint: `/measurement/activity`,
      method: 'POST',
      version: '1.0',
      data: request
    });
  }

  /**
   * Delete activity measurement for a single user.
   * Permissions: Provider, Client, OrgAccess, OrgClientPHI
   *
   * @param request must implement DeleteMeasurementActivityRequest
   * @return Promise<void>
   */
  public delete(request: DeleteMeasurementActivityRequest): Promise<void> {
    return this.apiService.request({
      endpoint: `/measurement/activity`,
      method: 'DELETE',
      version: '1.0',
      data: request
    });
  }

  /**
   * Record detailed activity measurements for a client.
   * Permissions: Client, Provider, OrgAccess, OrgClientPHI
   *
   * @param request must implement AddDetailedMeasurementActivityRequest
   * @return Promise<void>
   */
  public addDetailed(request: AddDetailedMeasurementActivityRequest): Promise<void> {
    return this.apiService.request({
      endpoint: `/measurement/activity/detailed`,
      method: 'POST',
      version: '1.0',
      data: request
    });
  }
}
