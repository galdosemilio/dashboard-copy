import { ApiService } from '../../services/api.service'
import { Entity } from '../common/entities'

import {
  CreateFormAddendumRequest,
  GetAllFormAddendumRequest
} from './requests'
import { FormAddendumSingle, GetAllFormAddendumResponse } from './responses'

export class FormAddendum {
  public constructor(private readonly apiService: ApiService) {}

  /**
   * Creates a new addendum.
   * Permissions: Provider, Client, OrgAssociation
   *
   * @param request must implement CreateFormAddendumRequest
   * @return Promise<Entity>
   */
  public create(request: CreateFormAddendumRequest): Promise<Entity> {
    return this.apiService.request({
      endpoint: `/content/form/addendum`,
      method: 'POST',
      version: '1.0',
      data: request
    })
  }

  /**
   * Retrieves a single addendum with a specific ID.
   * Permissions: Provider, Client, OrgAssociation
   *
   * @param request must implement Entity
   * @return Promise<FormAddendumSingle>
   */
  public getSingle(request: Entity): Promise<FormAddendumSingle> {
    return this.apiService.request({
      endpoint: `/content/form/addendum/${request.id}`,
      method: 'GET',
      version: '1.0'
    })
  }

  /**
   * Retrieves paged addendums collection for a form.
   * Permissions: Provider, Client, OrgAssociation
   *
   * @param request must implement GetAllFormAddendumRequest
   * @return Promise<GetAllFormAddendumResponse>
   */
  public getAll(
    request: GetAllFormAddendumRequest
  ): Promise<GetAllFormAddendumResponse> {
    return this.apiService.request({
      endpoint: `/content/form/addendum`,
      method: 'GET',
      version: '1.0',
      data: request
    })
  }
}
