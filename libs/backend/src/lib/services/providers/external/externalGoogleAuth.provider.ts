import { Injectable } from '@angular/core';
import { ApiService } from '../../api.service';

import { Entity } from '../../shared';
import { GetAuthStatusExternalGoogleAuthRequest } from './requests';

@Injectable({
  providedIn: 'root'
})
export class ExternalGoogleAuth {
  public constructor(private readonly apiService: ApiService) {}

  /**
   * Get an authentication URL for google calendar.
   *
   * @param request must implement Entity
   * @return Promise<void>
   */
  public getAuthUrl(request: Entity): Promise<void> {
    return this.apiService.request({
      endpoint: `/schedule/google/${request.id}/auth`,
      method: 'GET',
      version: '2.0'
    });
  }

  /**
   * Get Google's authentication status.
   *
   * @param request must implement GetAuthStatusExternalGoogleAuthRequest
   * @return Promise<void>
   */
  public getAuthStatus(request: GetAuthStatusExternalGoogleAuthRequest): Promise<void> {
    return this.apiService.request({
      endpoint: `/schedule/google/${request.id}/authStatus`,
      method: 'GET',
      version: '2.0',
      data: request
    });
  }
}
