import { ApiService } from '../../services/api.service'
import { Entity } from '../common/entities'

import {
  CreateFormQuestionRequest,
  GetAllFormQuestionRequest,
  UpdateFormQuestionRequest
} from './requests'
import { FormQuestionSingle, GetAllFormQuestionResponse } from './responses'

export class FormQuestion {
  public constructor(private readonly apiService: ApiService) {}

  /**
   * Creates a new question.
   * Permissions: Provider, Admin, OrgAdmin
   *
   * @param request must implement CreateFormQuestionRequest
   * @return Promise<Entity>
   */
  public create(request: CreateFormQuestionRequest): Promise<Entity> {
    return this.apiService.request({
      endpoint: `/content/form/question`,
      method: 'POST',
      version: '1.0',
      data: request
    })
  }

  /**
   * Retrieves all questions for form section as collection.
   * Permissions: Provider, Admin, OrgAssociation
   *
   * @param request must implement GetAllFormQuestionRequest
   * @return Promise<GetAllFormQuestionResponse>
   */
  public getAll(
    request: GetAllFormQuestionRequest
  ): Promise<GetAllFormQuestionResponse> {
    return this.apiService.request({
      endpoint: `/content/form/question`,
      method: 'GET',
      version: '1.0',
      data: request
    })
  }

  /**
   * Retrieves a single question with a specific ID.
   * Permissions: Provider, Admin, OrgAssociation
   *
   * @param request must implement Entity
   * @return Promise<FormQuestionSingle>
   */
  public getSingle(request: Entity): Promise<FormQuestionSingle> {
    return this.apiService.request({
      endpoint: `/content/form/question/${request.id}`,
      method: 'GET',
      version: '1.0'
    })
  }

  /**
   * Updates a question with a specific ID.
   * Permissions: Provider, Admin, OrgAdmin
   *
   * @param request must implement UpdateFormQuestionRequest
   * @return Promise<void>
   */
  public update(request: UpdateFormQuestionRequest): Promise<void> {
    return this.apiService.request({
      endpoint: `/content/form/question/${request.id}`,
      method: 'PATCH',
      version: '1.0',
      data: request
    })
  }

  /**
   * Deletes a question with a specific ID.
   * Permissions: Provider, Admin, OrgAdmin
   *
   * @param request must implement Entity
   * @return Promise<void>
   */
  public delete(request: Entity): Promise<void> {
    return this.apiService.request({
      endpoint: `/content/form/question/${request.id}`,
      method: 'DELETE',
      version: '1.0'
    })
  }
}
