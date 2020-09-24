import { Injectable } from '@angular/core';
import { ApiService } from '../../api.service';

import {
  AuthLevlExternalAuthRequest,
  GetAvailableTokensExternalAuthRequest,
  RevokeAllExternalAuthRequest,
  RevokeExternalAuthRequest
} from './requests';
import {
  AuthFitbitExternalAuthResponse,
  AuthGoogleExternalAuthResponse,
  GetAvailableTokensExternalAuthResponse
} from './responses';

@Injectable({
  providedIn: 'root'
})
export class ExternalAuth {
  public constructor(private readonly apiService: ApiService) {}

  /**
   * Returns fitbit OAuth2 authentication url.
   *
   * @return Promise<AuthFitbitExternalAuthResponse>
   */
  public authFitbit(): Promise<AuthFitbitExternalAuthResponse> {
    return this.apiService.request({
      endpoint: `/authentication/fitbit`,
      method: 'GET',
      version: '1.0'
    });
  }

  /**
   * Returns Google OAuth2 authentication url.
   *
   * @return Promise<AuthGoogleExternalAuthResponse>
   */
  public authGoogle(): Promise<AuthGoogleExternalAuthResponse> {
    return this.apiService.request({
      endpoint: `/authentication/google`,
      method: 'GET',
      version: '1.0'
    });
  }

  /**
   * Authenticates Levl user.
   *
   * @param request must implement AuthLevlExternalAuthRequest
   * @return Promise<void>
   */
  public authLevl(request: AuthLevlExternalAuthRequest): Promise<void> {
    return this.apiService.request({
      endpoint: `/authentication/levl`,
      method: 'POST',
      version: '1.0',
      data: request
    });
  }

  /**
   * Creates an entry to indicate that Apple HealthKit is connected for authenticated account. Accessible only to clients.
   * Permissions: Client
   *
   * @return Promise<void>
   */
  public authHealthkit(): Promise<void> {
    return this.apiService.request({
      endpoint: `/authentication/healthkit`,
      method: 'POST',
      version: '1.0'
    });
  }

  /**
   * Gets a list of authentication tokens to 3rd party services for a specified account.
   *
   * @param request must implement GetAvailableTokensExternalAuthRequest
   * @return Promise<GetAvailableTokensExternalAuthResponse>
   */
  public getAvailableTokens(
    request: GetAvailableTokensExternalAuthRequest
  ): Promise<GetAvailableTokensExternalAuthResponse> {
    return this.apiService.request({
      endpoint: `/authentication/${request.account}`,
      method: 'GET',
      version: '1.0'
    });
  }

  /**
   * Revokes access to a specific service for a given account.
   *
   * @param request must implement RevokeExternalAuthRequest
   * @return Promise<void>
   */
  public revoke(request: RevokeExternalAuthRequest): Promise<void> {
    return this.apiService.request({
      endpoint: `/authentication/${request.account}/${request.service}`,
      method: 'DELETE',
      version: '1.0'
    });
  }

  /**
   * Revokes access to all services for a given account.
   *
   * @param request must implement RevokeAllExternalAuthRequest
   * @return Promise<void>
   */
  public revokeAll(request: RevokeAllExternalAuthRequest): Promise<void> {
    return this.apiService.request({
      endpoint: `/authentication/${request.account}`,
      method: 'DELETE',
      version: '1.0'
    });
  }
}
