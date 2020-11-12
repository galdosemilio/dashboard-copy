import { ApiService } from '../../services/api.service'
import { Entity } from '../common/entities'

import {
  CreateFormSectionRequest,
  GetAllFormSectionRequest,
  UpdateFormSectionRequest
} from './requests'
import { FormSectionSingle, GetAllFormSectionResponse } from './responses'

export class FormSection {
  public constructor(private readonly apiService: ApiService) {}

  /**
   * Retrieves all sections related to the form.
   * Permissions: Provider, Admin, OrgAssociation
   *
   * @param request must implement GetAllFormSectionRequest
   * @return Promise<GetAllFormSectionResponse>
   */
  public getAll(
    request: GetAllFormSectionRequest
  ): Promise<GetAllFormSectionResponse> {
    return this.apiService.request({
      endpoint: `/content/form/section`,
      method: 'GET',
      version: '1.0',
      data: request
    })
  }

  /**
   * Retrieves single section.
   * Permissions: Provider, Admin, OrgAssociation
   *
   * @param request must implement Entity
   * @return Promise<FormSectionSingle>
   */
  public getSingle(request: Entity): Promise<FormSectionSingle> {
    return this.apiService.request({
      endpoint: `/content/form/section/${request.id}`,
      method: 'GET',
      version: '1.0'
    })
  }

  /**
   * Creates a new section.
   * Permissions: Provider, Admin, OrgAdmin
   *
   * @param request must implement CreateFormSectionRequest
   * @return Promise<Entity>
   */
  public create(request: CreateFormSectionRequest): Promise<Entity> {
    return this.apiService.request({
      endpoint: `/content/form/section`,
      method: 'POST',
      version: '1.0',
      data: request
    })
  }

  /**
   * Updates a section with a specific ID.
   * Permissions: Provider, Admin, OrgAdmin
   *
   * @param request must implement UpdateFormSectionRequest
   * @return Promise<void>
   */
  public update(request: UpdateFormSectionRequest): Promise<void> {
    return this.apiService.request({
      endpoint: `/content/form/section/${request.id}`,
      method: 'PATCH',
      version: '1.0',
      data: request
    })
  }

  /**
   * Deletes a section with a specific ID.
   * Permissions: Provider, Admin, OrgAdmin
   *
   * @param request must implement Entity
   * @return Promise<void>
   */
  public delete(request: Entity): Promise<void> {
    return this.apiService.request({
      endpoint: `/content/form/section/${request.id}`,
      method: 'DELETE',
      version: '1.0'
    })
  }
}
