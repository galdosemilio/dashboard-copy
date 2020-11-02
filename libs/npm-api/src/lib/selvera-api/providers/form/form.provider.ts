import { ApiService } from '../../services/api.service'
import { Entity } from '../common/entities'

import {
  CloneFormRequest,
  CreateFormRequest,
  GetAllFormRequest,
  GetSingleFormRequest,
  UpdateFormRequest
} from './requests'
import { FormSingle, GetAllFormResponse } from './responses'

export class Form {
  public constructor(private readonly apiService: ApiService) {}

  /**
   * Create a form duplicate
   * Permissions: Provider, Admin
   *
   * @param request must Implement CloneFormRequest
   * @returns Promise<Entity>
   */
  public clone(request: CloneFormRequest): Promise<Entity> {
    return this.apiService.request({
      data: request,
      endpoint: '/content/form/clone',
      method: 'POST',
      version: '1.0'
    })
  }

  /**
   * Creates a form.
   * Permissions: Provider, Admin, OrgAdmin
   *
   * @param request must implement CreateFormRequest
   * @return Promise<Entity>
   */
  public create(request: CreateFormRequest): Promise<Entity> {
    return this.apiService.request({
      endpoint: `/content/form`,
      method: 'POST',
      version: '1.0',
      data: request
    })
  }

  /**
   * Retrieves a list of available forms.
   * Permissions: OrgAssociation
   *
   * @param request must implement GetAllFormRequest
   * @return Promise<GetAllFormResponse>
   */
  public getAll(request: GetAllFormRequest): Promise<GetAllFormResponse> {
    return this.apiService.request({
      endpoint: `/content/form`,
      method: 'GET',
      version: '1.0',
      data: request
    })
  }

  /**
   * Retrieves a single form.
   *
   * @param request must implement GetSingleFormRequest
   * @return Promise<FormSingle>
   */
  public getSingle(request: GetSingleFormRequest): Promise<FormSingle> {
    return this.apiService.request({
      endpoint: `/content/form/${request.id}`,
      method: 'GET',
      version: '1.0',
      data: request
    })
  }

  /**
   * Updates a form.
   * Permissions: Provider, Admin
   *
   * @param request must implement UpdateFormRequest
   * @return Promise<void>
   */
  public update(request: UpdateFormRequest): Promise<void> {
    return this.apiService.request({
      endpoint: `/content/form/${request.id}`,
      method: 'PATCH',
      version: '1.0',
      data: request
    })
  }

  /**
   * Deletes a form.
   * Permissions: Provider, Admin
   *
   * @param request must implement Entity
   * @return Promise<void>
   */
  public delete(request: Entity): Promise<void> {
    return this.apiService.request({
      endpoint: `/content/form/${request.id}`,
      method: 'DELETE',
      version: '1.0'
    })
  }
}
