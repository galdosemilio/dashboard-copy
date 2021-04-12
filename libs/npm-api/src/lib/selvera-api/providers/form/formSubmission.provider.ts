import { ApiService } from '../../services/api.service'
import { Entity } from '../common/entities'

import {
  CreateFormSubmissionRequest,
  DeleteFormSubmissionDraftRequest,
  GetAllFormSubmissionRequest,
  GetFormSubmissionDraftRequest,
  UpsertFormSubmissionDraftRequest
} from './requests'
import { FormSubmissionSingle, GetAllFormSubmissionResponse } from './responses'

export class FormSubmission {
  public constructor(private readonly apiService: ApiService) {}

  /**
   * Gets all form submissions for specified account & organization hierarchy.
   * Permissions: Client, Provider, OrgAssociation
   *
   * @param request must implement GetAllFormSubmissionRequest
   * @return Promise<GetAllFormSubmissionResponse>
   */
  public getAll(
    request: GetAllFormSubmissionRequest
  ): Promise<GetAllFormSubmissionResponse> {
    return this.apiService.request({
      endpoint: `/content/form/submission`,
      method: 'GET',
      version: '1.0',
      data: request
    })
  }

  /**
   * Gets a single form submission with all answers included in the response.
   * Permissions: Client, Provider, OrgAssociation
   *
   * @param request must implement Entity
   * @return Promise<FormSubmissionSingle>
   */
  public getSingle(request: Entity): Promise<FormSubmissionSingle> {
    return this.apiService.request({
      endpoint: `/content/form/submission/${request.id}`,
      method: 'GET',
      version: '1.0'
    })
  }

  /**
   * Creates a new form submission.
   * Permissions: Client, Provider, OrgAssociation
   *
   * @param request must implement CreateFormSubmissionRequest
   * @return Promise<Entity>
   */
  public create(request: CreateFormSubmissionRequest): Promise<Entity> {
    return this.apiService.request({
      endpoint: `/content/form/submission`,
      method: 'POST',
      version: '1.0',
      data: request
    })
  }

  /**
   * Removes a single form submission
   * Permissions: Provider, OrgAssociation
   *
   * @param request must implement Entity
   * @returns Promise<void>
   */
  public delete(request: Entity): Promise<void> {
    return this.apiService.request({
      endpoint: `/content/form/submission/${request.id}`,
      method: 'DELETE',
      version: '1.0',
      data: request
    })
  }

  /**
   * Set the autosaved draft
   * @param request must implement UpsertFormSubmissionDraft
   * @returns Promise<any>
   */
  public upsertDraft(request: UpsertFormSubmissionDraftRequest): Promise<any> {
    return this.apiService.request({
      endpoint: `/content/form/submission/draft/${request.form}`,
      method: 'PUT',
      version: '1.0',
      data: request
    })
  }

  /**
   * Get the autosaved draft
   * @param request must implement GetFormSubmissionDraft
   * @returns Promise<any>
   */
  public getDraft(request: GetFormSubmissionDraftRequest): Promise<any> {
    return this.apiService.request({
      endpoint: `/content/form/submission/draft/${request.form}`,
      method: 'GET',
      version: '1.0',
      data: request
    })
  }

  /**
   * Remove the autosaved draft
   * @param request must implement DeleteFormSubmissionDraft
   * @returns Promise<void>
   */
  public deleteDraft(request: DeleteFormSubmissionDraftRequest): Promise<void> {
    return this.apiService.request({
      endpoint: `/content/form/submission/draft/${request.form}`,
      method: 'DELETE',
      version: '1.0',
      data: request
    })
  }
}
