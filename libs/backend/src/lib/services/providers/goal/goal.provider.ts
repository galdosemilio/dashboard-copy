import { Injectable } from '@angular/core';
import { ApiService } from '../../api.service';

import { Entity } from '../../shared';
import { GetSingleGoalRequest, UpdateGoalRequest, UpsertGoalRequest } from './requests';
import { GoalSingle } from './responses';

@Injectable({
  providedIn: 'root'
})
export class Goal {
  public constructor(private readonly apiService: ApiService) {}

  /**
   * Fetch goals for a single user.
   * Permissions: OrgAccess, OrgClientPHI
   *
   * @param [request] must implement GetSingleGoalRequest
   * @return Promise<GoalSingle>
   */
  public getSingle(request?: GetSingleGoalRequest): Promise<GoalSingle> {
    return this.apiService.request({
      endpoint: `/goal`,
      method: 'GET',
      version: '2.0',
      data: request
    });
  }

  /**
   * Upsert goal record.
   * Permissions: OrgAccess, OrgClientPHI
   *
   * @param request must implement UpsertGoalRequest
   * @return Promise<void>
   */
  public upsert(request: UpsertGoalRequest): Promise<void> {
    return this.apiService.request({
      endpoint: `/goal`,
      method: 'PUT',
      version: '2.0',
      data: request
    });
  }

  /**
   * Update goal record.
   * Permissions: Client
   *
   * @param request must implement UpdateGoalRequest
   * @return Promise<void>
   */
  public update(request: UpdateGoalRequest): Promise<void> {
    return this.apiService.request({
      endpoint: `/goal/${request.id}`,
      method: 'PUT',
      version: '2.0',
      data: request
    });
  }

  /**
   * Delete goal record.
   * Permissions: Client
   *
   * @param request must implement Entity
   * @return Promise<void>
   */
  public delete(request: Entity): Promise<void> {
    return this.apiService.request({
      endpoint: `/goal/${request.id}`,
      method: 'DELETE',
      version: '2.0'
    });
  }
}
