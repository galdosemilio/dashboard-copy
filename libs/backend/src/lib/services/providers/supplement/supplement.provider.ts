import { Injectable } from '@angular/core';
import { ApiService } from '../../api.service';

import { Entity } from '../../shared';
import {
  CreateSupplementRequest,
  GetAllSupplementRequest,
  GetSummarySupplementRequest,
  UpdateSupplementRequest
} from './requests';
import { GetAllSupplementResponse, GetSummarySupplementResponse } from './responses';

@Injectable({
  providedIn: 'root'
})
export class Supplement {
  public constructor(private readonly apiService: ApiService) {}

  /**
   * Search supplements by full or short name, filtering by activity status. Response is paged.
   * Permissions: Admin
   *
   * @param request must implement GetAllSupplementRequest
   * @return Promise<GetAllSupplementResponse>
   */
  public getAll(request: GetAllSupplementRequest): Promise<GetAllSupplementResponse> {
    return this.apiService.request({
      endpoint: `/supplement`,
      method: 'GET',
      version: '3.0',
      data: request
    });
  }

  /**
   * Create new supplement.
   * Permissions: Admin
   *
   * @param request must implement CreateSupplementRequest
   * @return Promise<Entity> ID of the created supplement
   */
  public create(request: CreateSupplementRequest): Promise<Entity> {
    return this.apiService
      .request({
        endpoint: `/supplement`,
        method: 'POST',
        version: '2.0',
        data: request
      })
      .then(res => ({ id: res.supplementId.toString() }));
  }

  /**
   * Update existing supplement.
   * Permissions: Admin
   *
   * @param request must implement UpdateSupplementRequest
   * @return Promise<void>
   */
  public update(request: UpdateSupplementRequest): Promise<void> {
    return this.apiService.request({
      endpoint: `/supplement/${request.id}`,
      method: 'PUT',
      version: '2.0',
      data: request
    });
  }

  /**
   * Get supplement consumption summary.
   * Permissions: Provider, Client, OrgAccess, OrgClientPHI
   *
   * @param request must implement GetSummarySupplementRequest
   * @return Promise<GetSummarySupplementResponse>
   */
  public getSummary(request: GetSummarySupplementRequest): Promise<GetSummarySupplementResponse> {
    return this.apiService.request({
      endpoint: `/supplement/summary`,
      method: 'GET',
      version: '2.0',
      data: request
    });
  }
}
