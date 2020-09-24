import { Injectable } from '@angular/core';
import { ApiService } from '../../api.service';

import {
  DeleteLocalePackageRequest,
  GetLocalePackageRequest,
  UpdateLocalePackageRequest
} from './requests';
import { GetLocalePackageResponse } from './responses';

@Injectable({
  providedIn: 'root'
})
export class LocalePackage {
  public constructor(private readonly apiService: ApiService) {}

  /**
   * Get a translation for specific package & locale.
   * Permissions: Admin
   *
   * @param request must implement GetLocalePackageRequest
   * @return Promise<GetLocalePackageResponse>
   */
  public get(request: GetLocalePackageRequest): Promise<GetLocalePackageResponse> {
    return this.apiService.request({
      endpoint: `/package/${request.id}/locale/${request.locale}`,
      method: 'GET',
      version: '2.0'
    });
  }

  /**
   * Create a translation for specific package & locale.
   * Permissions: Admin
   *
   * @param request must implement UpdateLocalePackageRequest
   * @return Promise<void>
   */
  public update(request: UpdateLocalePackageRequest): Promise<void> {
    return this.apiService.request({
      endpoint: `/package/${request.id}/locale/${request.locale}`,
      method: 'PUT',
      version: '2.0',
      data: request
    });
  }

  /**
   * Deletes a translation for specific package & locale.
   * Permissions: Admin
   *
   * @param request must implement DeleteLocalePackageRequest
   * @return Promise<void>
   */
  public delete(request: DeleteLocalePackageRequest): Promise<void> {
    return this.apiService.request({
      endpoint: `/package/${request.id}/locale/${request.locale}`,
      method: 'DELETE',
      version: '2.0'
    });
  }
}
