import { Injectable } from '@angular/core';
import { ApiService } from '../../api.service';

import {
  GetLastActivityExternalDeviceRequest,
  SyncExternalDeviceRequest,
  SyncHealthKitExternalDeviceRequest
} from './requests';
import { GetAllExternalDeviceResponse, GetLastActivityExternalDeviceResponse } from './responses';

@Injectable({
  providedIn: 'root'
})
export class ExternalDevice {
  public constructor(private readonly apiService: ApiService) {}

  /**
   * Returns all available measurement devices.
   *
   * @return Promise<GetAllExternalDeviceResponse>
   */
  public getAll(): Promise<GetAllExternalDeviceResponse> {
    return this.apiService.request({
      endpoint: `/measurement/device`,
      method: 'GET',
      version: '2.0'
    });
  }

  /**
   * Returns all available, paired measurement devices with the last sync date for an account.
   *
   * @param request must implement GetLastActivityExternalDeviceRequest
   * @return Promise<GetLastActivityExternalDeviceResponse>
   */
  public getLastActivity(
    request: GetLastActivityExternalDeviceRequest
  ): Promise<GetLastActivityExternalDeviceResponse> {
    return this.apiService.request({
      endpoint: `/measurement/device/sync`,
      method: 'GET',
      version: '2.0',
      data: request
    });
  }

  /**
   * Update last sync date for healthkit device.
   * Permissions: Client
   *
   * @param [request] must implement SyncHealthKitExternalDeviceRequest
   * @return Promise<void>
   */
  public syncHealthKit(request?: SyncHealthKitExternalDeviceRequest): Promise<void> {
    return this.apiService.request({
      endpoint: `/measurement/device/sync/healthkit`,
      method: 'PUT',
      version: '2.0',
      data: request
    });
  }

  /**
   * Kick off the syncing process for a specified account & service/device for data in the provided date range.
   * Permissions: Client
   *
   * @param request must implement SyncExternalDeviceRequest
   * @return Promise<void>
   */
  public sync(request: SyncExternalDeviceRequest): Promise<void> {
    return this.apiService.request({
      endpoint: `/measurement/device/sync`,
      method: 'PUT',
      version: '2.0',
      data: request
    });
  }
}
