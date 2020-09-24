import { Injectable } from '@angular/core';
import { ApiService } from '../../api.service';

import { Entity } from '../../shared';
import { CreateExerciseRequest, GetAllExerciseRequest, UpdateExerciseRequest } from './requests';
import { ExerciseSingle, GetAllExerciseResponse } from './responses';

@Injectable({
  providedIn: 'root'
})
export class Exercise {
  public constructor(private readonly apiService: ApiService) {}

  /**
   * Create exercise entry for account. Restricted to clients.
   * Permissions: Client
   *
   * @param request must implement CreateExerciseRequest
   * @return Promise<Entity>
   */
  public create(request: CreateExerciseRequest): Promise<Entity> {
    return this.apiService.request({
      endpoint: `/measurement/exercise`,
      method: 'POST',
      version: '2.0',
      data: request
    });
  }

  /**
   * Update exercise entry. Restricted to clients.
   * Permissions: Client
   *
   * @param request must implement UpdateExerciseRequest
   * @return Promise<void>
   */
  public update(request: UpdateExerciseRequest): Promise<void> {
    return this.apiService.request({
      endpoint: `/measurement/exercise/${request.id}`,
      method: 'PATCH',
      version: '2.0',
      data: request
    });
  }

  /**
   * Fetch exercise entries as paged response.
   * Clients can access only to their own exercises, providers - to exercises of accessible clients.
   * Permissions: Provider, Client, OrgAccess, OrgClientPHI
   *
   * @param [request] must implement GetAllExerciseRequest
   * @return Promise<GetAllExerciseResponse>
   */
  public getAll(request?: GetAllExerciseRequest): Promise<GetAllExerciseResponse> {
    return this.apiService.request({
      endpoint: `/measurement/exercise`,
      method: 'GET',
      version: '2.0',
      data: request
    });
  }

  /**
   * Fetch single exercise entry. Clients can access only to their own exercises, providers - to exercises of accessible clients.
   * Permissions: Provider, Client, OrgAccess, OrgClientPHI
   *
   * @param request must implement Entity
   * @return Promise<ExerciseSingle>
   */
  public getSingle(request: Entity): Promise<ExerciseSingle> {
    return this.apiService.request({
      endpoint: `/measurement/exercise/${request.id}`,
      method: 'GET',
      version: '2.0'
    });
  }

  /**
   * Delete exercise for an account. Restricted to Clients, which can delete only their own exercises.
   * Permissions: Client
   *
   * @param request must implement Entity
   * @return Promise<void>
   */
  public delete(request: Entity): Promise<void> {
    return this.apiService.request({
      endpoint: `/measurement/exercise/${request.id}`,
      method: 'DELETE',
      version: '2.0'
    });
  }
}
