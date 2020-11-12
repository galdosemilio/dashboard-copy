import { ApiService } from '../../services/api.service'
import { Entity } from '../common/entities'
import {
  CreateExerciseRequest,
  GetAllExerciseRequest,
  UpdateExerciseRequest
} from './requests'
import { GetAllExerciseResponse, GetSingleExerciseResponse } from './responses'

export class Exercise {
  public constructor(private readonly apiService: ApiService) {}

  /**
   * Fetch exercise entries as paged response.
   * Clients can access only to their own exercises, providers - to exercises of accessible clients.
   *
   * @param request must implement GetAllExerciseRequest
   * @return Promise<GetAllExerciseResponse>
   */
  public getAll(
    request?: GetAllExerciseRequest
  ): Promise<GetAllExerciseResponse> {
    return this.apiService.request({
      endpoint: `/measurement/exercise`,
      method: 'GET',
      version: '2.0',
      data: request
    })
  }

  /**
   * Fetch single exercise entry.
   * Clients can access only to their own exercises, providers - to exercises of accessible clients.
   *
   * @param request must implement Entity
   * @return Promise<GetSingleExerciseResponse>
   */
  public getSingle(request: Entity): Promise<GetSingleExerciseResponse> {
    return this.apiService.request({
      endpoint: `/measurement/exercise/${request.id}`,
      method: 'GET',
      version: '2.0'
    })
  }

  /**
   * Create exercise entry for account.
   * Restricted to clients.
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
    })
  }

  /**
   * Update exercise for an account.
   * Restricted to Clients, which can delete only their own exercises.
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
    })
  }

  /**
   * Delete exercise for an account.
   * Restricted to Clients, which can delete only their own exercises.
   *
   * @param request must implement Entity
   * @return Promise<void>
   */
  public delete(request: Entity): Promise<void> {
    return this.apiService.request({
      endpoint: `/measurement/exercise/${request.id}`,
      method: 'DELETE',
      version: '2.0'
    })
  }
}
