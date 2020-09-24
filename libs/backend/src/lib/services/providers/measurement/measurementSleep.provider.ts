import { Injectable } from '@angular/core';
import { ApiService } from '../../api.service';

import {
  CreateMeasurementSleepRequest,
  GetAllDetailedMeasurementSleepRequest,
  GetAllMeasurementSleepRequest,
  GetAllWithSummaryMeasurementSleepRequest
} from './requests';
import {
  GetAllDetailedMeasurementSleepResponse,
  GetAllMeasurementSleepResponse,
  GetAllWithSummaryMeasurementSleepResponse
} from './responses';

@Injectable({
  providedIn: 'root'
})
export class MeasurementSleep {
  public constructor(private readonly apiService: ApiService) {}

  /**
   * Fetch sleep measurements and summary.
   * Permissions: Provider, Client, OrgAccess, OrgClientPHI
   *
   * @param request must implement GetAllWithSummaryMeasurementSleepRequest
   * @return Promise<GetAllWithSummaryMeasurementSleepResponse>
   */
  public getAllWithSummary(
    request: GetAllWithSummaryMeasurementSleepRequest
  ): Promise<GetAllWithSummaryMeasurementSleepResponse> {
    return this.apiService.request({
      endpoint: `/measurement/sleep/summary`,
      method: 'GET',
      version: '1.0',
      data: request
    });
  }

  /**
   * Fetch basic (non-detailed) sleep measurements for a single user, during a defined date range.
   * If no date range is provided (start_date and end_date) results for the current day will be returned.
   * Permissions: Provider, Client, OrgAccess, OrgClientPHI
   *
   * @param [request] must implement GetAllMeasurementSleepRequest
   * @return Promise<GetAllMeasurementSleepResponse>
   */
  public getAll(request?: GetAllMeasurementSleepRequest): Promise<GetAllMeasurementSleepResponse> {
    return this.apiService.request({
      endpoint: `/measurement/sleep`,
      method: 'GET',
      version: '1.0',
      data: request
    });
  }

  /**
   * Fetch detailed measurements for a single user, during a defined date range.
   * If no date range is provided (start_date and end_date) results for the current day will be returned.
   * Permissions: Provider, Client, OrgAccess, OrgClientPHI
   *
   * @param [request] must implement GetAllDetailedMeasurementSleepRequest
   * @return Promise<GetAllDetailedMeasurementSleepResponse>
   */
  public getAllDetailed(
    request?: GetAllDetailedMeasurementSleepRequest
  ): Promise<GetAllDetailedMeasurementSleepResponse> {
    return this.apiService.request({
      endpoint: `/measurement/sleep/detailed`,
      method: 'GET',
      version: '1.0',
      data: request
    });
  }

  /**
   * Post sleep measurements for a single user, during a defined date range.
   * Permissions: Provider, Client, OrgAccess, OrgClientPHI
   *
   * @param request must implement CreateMeasurementSleepRequest
   * @return Promise<void>
   */
  public create(request: CreateMeasurementSleepRequest): Promise<void> {
    return this.apiService.request({
      endpoint: `/measurement/sleep`,
      method: 'POST',
      version: '1.0',
      data: request
    });
  }
}
