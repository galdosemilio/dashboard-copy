import { Injectable } from '@angular/core';
import { ApiService } from '../../api.service';

import { Entity } from '../../shared';
import { CreateFormSubmissionRequest, GetAllFormSubmissionRequest } from './requests';
import { FormSubmissionSingle, GetAllFormSubmissionResponse } from './responses';

@Injectable({
  providedIn: 'root'
})
export class FormSubmission {
  public constructor(private readonly apiService: ApiService) {}

  /**
   * Gets all form submissions for specified account & organization hierarchy.
   * Permissions: Client, Provider, OrgAssociation
   *
   * @param request must implement GetAllFormSubmissionRequest
   * @return Promise<GetAllFormSubmissionResponse>
   */
  public getAll(request: GetAllFormSubmissionRequest): Promise<GetAllFormSubmissionResponse> {
    return this.apiService.request({
      endpoint: `/content/form/submission`,
      method: 'GET',
      version: '1.0',
      data: request
    });
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
    });
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
    });
  }
}
