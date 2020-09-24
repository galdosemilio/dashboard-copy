import { Injectable } from '@angular/core';
import { ApiService } from '../../api.service';
import { Entity } from '../../shared';
import { MessagingPreferenceSingle } from './entities';
import {
  CreateMessagingPreferenceRequest,
  GetSingleMessagingPreferenceByOrgRequest,
  UpdateMessagingPreferenceRequest
} from './requests';

@Injectable({
  providedIn: 'root'
})
export class MessagingPreference {
  public constructor(private readonly apiService: ApiService) {}

  public createPreference(request: CreateMessagingPreferenceRequest): Promise<Entity> {
    return this.apiService.request({
      data: request,
      endpoint: '/message/preference/organization',
      method: 'POST',
      version: '1.0'
    });
  }

  public deleteMessagePreference(request: Entity): Promise<void> {
    return this.apiService.request({
      data: request,
      endpoint: `/message/preference/organization/${request.id}`,
      method: 'DELETE',
      version: '1.0'
    });
  }

  public getPreferenceByOrg(
    request: GetSingleMessagingPreferenceByOrgRequest
  ): Promise<MessagingPreferenceSingle> {
    return this.apiService.request({
      data: request,
      endpoint: '/message/preference/organization',
      method: 'GET',
      version: '1.0'
    });
  }

  public updatePreference(request: UpdateMessagingPreferenceRequest): Promise<void> {
    return this.apiService.request({
      data: request,
      endpoint: `/message/preference/organization/${request.id}`,
      method: 'PATCH',
      version: '1.0'
    });
  }
}
