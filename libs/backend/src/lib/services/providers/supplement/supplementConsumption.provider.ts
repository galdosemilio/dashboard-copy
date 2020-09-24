import { Injectable } from '@angular/core';
import { ApiService } from '../../api.service';

import { Entity } from '../../shared';
import {
  CreateSupplementConsumptionRequest,
  GetAllSupplementConsumptionRequest,
  UpdateSupplementConsumptionRequest
} from './requests';
import { GetAllSupplementConsumptionResponse } from './responses';

@Injectable({
  providedIn: 'root'
})
export class SupplementConsumption {
  public constructor(private readonly apiService: ApiService) {}

  /**
   * Get supplement intake, returns a maximum of 10 matching entries, ordered by supplement start date.
   * Permissions: Provider, Client, OrgAccess, OrgClientPHI
   *
   * @param [request] must implement GetAllSupplementConsumptionRequest
   * @return Promise<GetAllSupplementConsumptionResponse>
   */
  public getAll(
    request?: GetAllSupplementConsumptionRequest
  ): Promise<GetAllSupplementConsumptionResponse> {
    return this.apiService.request({
      endpoint: `/supplement/consumption`,
      method: 'GET',
      version: '2.0',
      data: request
    });
  }

  /**
   * Add supplement record for date.
   * If an entry already exists for specified date/account/supplement combination, it will be overwritten with this request.
   * Permissions: Provider, Client, OrgAccess, OrgClientPHI
   *
   * @param request must implement CreateSupplementConsumptionRequest
   * @return Promise<Entity> ID of the consumption entry
   */
  public create(request: CreateSupplementConsumptionRequest): Promise<Entity> {
    return this.apiService
      .request({
        endpoint: `/supplement/consumption`,
        method: 'POST',
        version: '2.0',
        data: request
      })
      .then(res => ({ id: res.consumptionId.toString() }));
  }

  /**
   * Update supplement for date specified.
   * Will add missing entries, update existing supplement entries and remove entries that are not in the collection.
   * Permissions: Provider, Client, OrgAccess, OrgClientPHI
   *
   * @param request must implement UpdateSupplementConsumptionRequest
   * @return Promise<void>
   */
  public update(request: UpdateSupplementConsumptionRequest): Promise<void> {
    return this.apiService.request({
      endpoint: `/supplement/consumption/${request.id}`,
      method: 'PUT',
      version: '2.0',
      data: request
    });
  }

  /**
   * Delete specific supplement entry for a specific date.
   * Permissions: Provider, Client, OrgAccess, OrgClientPHI
   *
   * @param request must implement Entity
   * @return Promise<void>
   */
  public delete(request: Entity): Promise<void> {
    return this.apiService.request({
      endpoint: `/supplement/consumption/${request.id}`,
      method: 'DELETE',
      version: '2.0'
    });
  }
}
