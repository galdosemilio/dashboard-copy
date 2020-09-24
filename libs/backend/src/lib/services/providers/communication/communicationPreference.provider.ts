import { Injectable } from '@angular/core';
import { ApiService } from '../../api.service';
import { Entity } from '../../shared';
import {
  CreateCommunicationPreferenceRequest,
  GetSingleCommunicationPreferenceRequest
} from './requests';

@Injectable({ providedIn: 'root' })
export class CommunicationPreference {
  public constructor(private readonly apiService: ApiService) {}

  public createPreference(request: CreateCommunicationPreferenceRequest): Promise<Entity> {
    return this.apiService.request({
      data: request,
      endpoint: '/communication/preference',
      method: 'POST',
      version: '1.0'
    });
  }

  public deletePreference(request: Entity): Promise<void> {
    return this.apiService.request({
      data: request,
      endpoint: `/communication/preference/${request.id}`,
      method: 'DELETE',
      version: '1.0'
    });
  }

  public getPreferenceByOrg(request: GetSingleCommunicationPreferenceRequest): Promise<any> {
    return this.apiService.request({
      data: request,
      endpoint: '/communication/preference',
      method: 'GET',
      version: '1.0'
    });
  }

  public updatePreference(request: any): Promise<void> {
    return this.apiService.request({
      data: request,
      endpoint: `/communication/preference/${request.id}`,
      method: 'PATCH',
      version: '1.0'
    });
  }
}
