import { Injectable } from '@angular/core';
import { ApiService } from '../../api.service';

import {
  DeleteLocaleSupplementRequest,
  GetLocaleSupplementRequest,
  UpdateLocaleSupplementRequest
} from './requests';
import { GetLocaleSupplementResponse } from './responses';

@Injectable({
  providedIn: 'root'
})
export class LocaleSupplement {
  public constructor(private readonly apiService: ApiService) {}

  /**
   * Get a translation for specific supplement & locale.
   * Permissions: Admin
   *
   * @param request must implement GetLocaleSupplementRequest
   * @return Promise<GetLocaleSupplementResponse>
   */
  public get(request: GetLocaleSupplementRequest): Promise<GetLocaleSupplementResponse> {
    return this.apiService.request({
      endpoint: `/supplement/${request.id}/locale/${request.locale}`,
      method: 'GET',
      version: '2.0'
    });
  }

  /**
   * Create a translation for specific supplement & locale.
   * Permissions: Admin
   *
   * @param request must implement UpdateLocaleSupplementRequest
   * @return Promise<void>
   */
  public update(request: UpdateLocaleSupplementRequest): Promise<void> {
    return this.apiService.request({
      endpoint: `/supplement/${request.id}/locale/${request.locale}`,
      method: 'PUT',
      version: '2.0',
      data: request
    });
  }

  /**
   * Deletes a translation for specific supplement & locale.
   * Permissions: Admin
   *
   * @param request must implement DeleteLocaleSupplementRequest
   * @return Promise<void>
   */
  public delete(request: DeleteLocaleSupplementRequest): Promise<void> {
    return this.apiService.request({
      endpoint: `/supplement/${request.id}/locale/${request.locale}`,
      method: 'DELETE',
      version: '2.0'
    });
  }
}
