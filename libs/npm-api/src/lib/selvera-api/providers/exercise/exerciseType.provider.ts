import { ApiService } from '../../services/api.service'
import { Entity } from '../common/entities'

import {
  CreateExerciseTypeRequest,
  GetAllExerciseTypeRequest,
  UpdateExerciseTypeRequest
} from './requests'
import {
  GetAllExerciseTypeResponse,
  GetSingleExerciseTypeResponse
} from './responses'

export class ExerciseType {
  public constructor(private readonly apiService: ApiService) {}

  /**
   * Create exercise type.
   * This endpoint available only to Admins.
   *
   * @param request must implement CreateExerciseTypeRequest
   * @return Promise<Entity>
   */
  public create(request: CreateExerciseTypeRequest): Promise<Entity> {
    return this.apiService.request({
      endpoint: `/measurement/exercise/type`,
      method: 'POST',
      version: '2.0',
      data: request
    })
  }

  /**
   * Update exercise type.
   * This endpoint available only to Admins.
   *
   * @param request must implement UpdateExerciseTypeRequest
   * @return Promise<void>
   */
  public update(request: UpdateExerciseTypeRequest): Promise<void> {
    return this.apiService.request({
      endpoint: `/measurement/exercise/type/${request.id}`,
      method: 'PATCH',
      version: '2.0',
      data: request
    })
  }

  /**
   * Fetch exercise type details.
   * This endpoint available only to Admins.
   *
   * @param request must implement Entity
   * @return Promise<GetSingleExerciseTypeResponse>
   */
  public getSingle(request: Entity): Promise<GetSingleExerciseTypeResponse> {
    return this.apiService.request({
      endpoint: `/measurement/exercise/type/${request.id}`,
      method: 'GET',
      version: '2.0'
    })
  }

  /**
   * Fetch all matching exercise types.
   *
   * @param request must implement GetAllExerciseTypeRequest
   * @return Promise<GetAllExerciseTypeResponse>
   */
  public getAll(
    request: GetAllExerciseTypeRequest
  ): Promise<GetAllExerciseTypeResponse> {
    return this.apiService.request({
      endpoint: `/measurement/exercise/type`,
      method: 'GET',
      version: '2.0',
      data: request
    })
  }
}
