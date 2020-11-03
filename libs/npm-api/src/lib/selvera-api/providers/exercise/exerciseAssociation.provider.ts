import { ApiService } from '../../services/api.service'
import { Entity } from '../common/entities'

import {
  CreateExerciseAssociationRequest,
  GetAllExerciseAssociationRequest,
  UpdateExerciseAssociationRequest
} from './requests'
import {
  GetAllExerciseAssociationResponse,
  GetSingleExerciseAssociationResponse
} from './responses'

export class ExerciseAssociation {
  public constructor(private readonly apiService: ApiService) {}

  /**
   * Create exercise type-organization association.
   * Available only for providers with 'admin' permission for requested organization.
   *
   * @param request must implement CreateExerciseAssociationRequest
   * @return Promise<Entity>
   */
  public create(request: CreateExerciseAssociationRequest): Promise<Entity> {
    return this.apiService.request({
      endpoint: `/measurement/exercise/association`,
      method: 'POST',
      version: '2.0',
      data: request
    })
  }

  /**
   * Fetch matching exercise type-organization associations.
   * Available only for providers with 'admin' permission for requested organization.
   *
   * @param request must implement GetAllExerciseAssociationRequest
   * @return Promise<GetAllExerciseAssociationResponse>
   */
  public getAll(
    request: GetAllExerciseAssociationRequest
  ): Promise<GetAllExerciseAssociationResponse> {
    return this.apiService.request({
      endpoint: `/measurement/exercise/association`,
      method: 'GET',
      version: '2.0',
      data: request
    })
  }

  /**
   * Fetch single exercise type-organization association details.
   * Available only for providers with 'admin' permission for requested organization.
   *
   * @param request must implement Entity
   * @return Promise<GetSingleExerciseAssociationResponse>
   */
  public getSingle(
    request: Entity
  ): Promise<GetSingleExerciseAssociationResponse> {
    return this.apiService.request({
      endpoint: `/measurement/exercise/association/${request.id}`,
      method: 'GET',
      version: '2.0'
    })
  }

  /**
   * Update exercise type-organization association.
   * Available only for providers with 'admin' permission for requested organization.
   *
   * @param request must implement UpdateExerciseAssociationRequest
   * @return Promise<void>
   */
  public update(request: UpdateExerciseAssociationRequest): Promise<void> {
    return this.apiService.request({
      endpoint: `/measurement/exercise/association/${request.id}`,
      method: 'PATCH',
      version: '2.0',
      data: request
    })
  }

  /**
   * Delete exercise type-organization association.
   * Available only for providers with 'admin' permission for requested organization.
   *
   * @param request must implement Entity
   * @return Promise<void>
   */
  public delete(request: Entity): Promise<void> {
    return this.apiService.request({
      endpoint: `/measurement/exercise/association/${request.id}`,
      method: 'DELETE',
      version: '2.0'
    })
  }
}
