import { Injectable } from '@angular/core';
import { ApiService } from '../../api.service';

import { Entity } from '../../shared';
import {
  CreateMeasurementBodyRequest,
  GetAllMeasurementBodyRequest,
  GetSampledMeasurementBodyRequest,
  GetSummaryMeasurementBodyRequest,
  UpdateMeasurementBodyRequest
} from './requests';
import {
  GetAllMeasurementBodyResponse,
  GetSampledMeasurementBodyResponse,
  GetSummaryMeasurementBodyResponse
} from './responses';

@Injectable({
  providedIn: 'root'
})
export class MeasurementBody {
  public constructor(private readonly apiService: ApiService) {}

  /**
   * Add a body measurements for a single user. Only clients and providers have access to this endpoint.
   * The measurement will be added for the authenticated user if client, or for the clientId if the requester is a provider.
   * Permissions: Provider, Client, OrgAccess, OrgClientPHI
   *
   * @param request must implement CreateMeasurementBodyRequest
   * @return Promise<Entity>
   */
  public create(request: CreateMeasurementBodyRequest): Promise<Entity> {
    return this.apiService.request({
      endpoint: `/measurement/body/`,
      method: 'POST',
      version: '2.0',
      data: request
    });
  }

  /**
   * Get body measurements and summary.
   * Permissions: Provider, Client, OrgAccess, OrgClientPHI
   *
   * @param request must implement GetAllMeasurementBodyRequest
   * @return Promise<GetAllMeasurementBodyResponse>
   */
  public getAll(request: GetAllMeasurementBodyRequest): Promise<GetAllMeasurementBodyResponse> {
    return this.apiService.request({
      endpoint: `/measurement/body`,
      method: 'GET',
      version: '2.0',
      data: request
    });
  }

  /**
   * Fetch sampled body measurement collection.
   * Permissions: Provider, Client, OrgAccess, OrgClientPHI
   *
   * @param [request] must implement GetSampledMeasurementBodyRequest
   * @return Promise<GetSampledMeasurementBodyResponse>
   */
  public getSampled(
    request?: GetSampledMeasurementBodyRequest
  ): Promise<GetSampledMeasurementBodyResponse> {
    return this.apiService.request({
      endpoint: `/measurement/body/sampled`,
      method: 'GET',
      version: '2.0',
      data: request
    });
  }

  /**
   * Get body measurements and summary.
   * Permissions: Provider, Client, OrgAccess, OrgClientPHI
   *
   * @param [request] must implement GetSummaryMeasurementBodyRequest
   * @return Promise<GetSummaryMeasurementBodyResponse>
   */
  public getSummary(
    request?: GetSummaryMeasurementBodyRequest
  ): Promise<GetSummaryMeasurementBodyResponse> {
    return this.apiService.request({
      endpoint: `/measurement/body/summary`,
      method: 'GET',
      version: '2.0',
      data: request
    });
  }

  /**
   * Update a body measurement.
   * Permissions: Provider, Client, OrgAccess, OrgClientPHI
   *
   * @param request must implement UpdateMeasurementBodyRequest
   * @return Promise<void>
   */
  public update(request: UpdateMeasurementBodyRequest): Promise<void> {
    return this.apiService.request({
      endpoint: `/measurement/body/${request.id}`,
      method: 'PATCH',
      version: '2.0',
      data: request
    });
  }

  /**
   * Delete a body measurement.
   * Permissions: Provider, Client, OrgAccess, OrgClientPHI
   *
   * @param request must implement Entity
   * @return Promise<void>
   */
  public delete(request: Entity): Promise<void> {
    return this.apiService.request({
      endpoint: `/measurement/body/${request.id}`,
      method: 'DELETE',
      version: '2.0'
    });
  }
}
