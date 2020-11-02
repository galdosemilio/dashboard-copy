import { ApiService } from '../../services/api.service'
import { Entity } from '../common/entities'

import {
  CreateFormQuestionTypeRequest,
  GetAllFormQuestionTypeRequest,
  UpdateFormQuestionTypeRequest
} from './requests'
import {
  FormQuestionTypeSingle,
  GetAllFormQuestionTypeResponse
} from './responses'

export class FormQuestionType {
  public constructor(private readonly apiService: ApiService) {}

  /**
   * Creates a question type.
   * Permissions: Admin
   *
   * @param request must implement CreateFormQuestionTypeRequest
   * @return Promise<Entity>
   */
  public create(request: CreateFormQuestionTypeRequest): Promise<Entity> {
    return this.apiService.request({
      endpoint: `/content/form/question-type`,
      method: 'POST',
      version: '1.0',
      data: request
    })
  }

  /**
   * Updates a question type.
   * Permissions: Admin
   *
   * @param request must implement UpdateFormQuestionTypeRequest
   * @return Promise<void>
   */
  public update(request: UpdateFormQuestionTypeRequest): Promise<void> {
    return this.apiService.request({
      endpoint: `/content/form/question-type/${request.id}`,
      method: 'PATCH',
      version: '1.0',
      data: request
    })
  }

  /**
   * Retrieves a list of available question types.
   * Permissions: Provider, Admin
   *
   * @param [request] must implement GetAllFormQuestionTypeRequest
   * @return Promise<GetAllFormQuestionTypeResponse>
   */
  public getAll(
    request?: GetAllFormQuestionTypeRequest
  ): Promise<GetAllFormQuestionTypeResponse> {
    return this.apiService.request({
      endpoint: `/content/form/question-type`,
      method: 'GET',
      version: '1.0',
      data: request
    })
  }

  /**
   * Retrieves a single question type.
   * Permissions: Provider, Admin
   *
   * @param request must implement Entity
   * @return Promise<FormQuestionTypeSingle>
   */
  public getSingle(request: Entity): Promise<FormQuestionTypeSingle> {
    return this.apiService.request({
      endpoint: `/content/form/question-type/${request.id}`,
      method: 'GET',
      version: '1.0'
    })
  }
}
