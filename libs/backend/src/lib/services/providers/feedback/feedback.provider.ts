import { Injectable } from '@angular/core';
import { ApiService } from '../../api.service';

import { Entity } from '../../shared';
import { SendFeedbackRequest } from './requests';

@Injectable({
  providedIn: 'root'
})
export class Feedback {
  public constructor(private readonly apiService: ApiService) {}

  /**
   * Creates a feedback ticket from a client in Zendesk.
   * Permissions: Client
   *
   * @param request must implement SendFeedbackRequest
   * @return Promise<Entity>
   */
  public send(request: SendFeedbackRequest): Promise<Entity> {
    return this.apiService.request({
      endpoint: `/feedback`,
      method: 'POST',
      version: '1.0',
      data: request
    });
  }
}
