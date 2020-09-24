import { Injectable } from '@angular/core';
import { ApiService } from '../../api.service';

import { Entity } from '../../shared';
import { GetAndroidRedirectMobileAppResponse, GetiOSRedirectMobileAppResponse } from './responses';

@Injectable({
  providedIn: 'root'
})
export class MobileApp {
  public constructor(private readonly apiService: ApiService) {}

  /**
   * Redirect to iOS application for given organization.
   * Permissions: Public
   *
   * @param request must implement Entity
   * @return Promise<GetiOSRedirectMobileAppResponse>
   */
  public getiOsRedirect(request: Entity): Promise<GetiOSRedirectMobileAppResponse> {
    return this.apiService.request({
      endpoint: `/app/ios/${request.id}`,
      method: 'GET',
      version: '1.0'
    });
  }

  /**
   * Redirect to Android application for given organization.
   * Permissions: Public
   *
   * @param request must implement Entity
   * @return Promise<GetAndroidRedirectMobileAppResponse>
   */
  public getAndroidRedirect(request: Entity): Promise<GetAndroidRedirectMobileAppResponse> {
    return this.apiService.request({
      endpoint: `/app/android/${request.id}`,
      method: 'GET',
      version: '1.0'
    });
  }
}
