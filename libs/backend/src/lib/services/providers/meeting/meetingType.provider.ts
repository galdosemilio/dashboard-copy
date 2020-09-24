import { Injectable } from '@angular/core';
import { ApiService } from '../../api.service';

import { Entity } from '../../shared';
import {
  CreateMeetingTypeRequest,
  GetAllMeetingTypeRequest,
  GetSingleMeetingTypeRequest,
  PutMeetingTypeRequest,
  UpdateMeetingTypeRequest
} from './requests';
import { GetAllMeetingTypeResponse, MeetingTypeSingle } from './responses';

@Injectable({
  providedIn: 'root'
})
export class MeetingType {
  public constructor(private readonly apiService: ApiService) {}

  /**
   * Add meeting type.
   * Permissions: Admin
   *
   * @param request must implement CreateMeetingTypeRequest
   * @return Promise<Entity> Type ID
   */
  public create(request: CreateMeetingTypeRequest): Promise<Entity> {
    return this.apiService
      .request({
        endpoint: `/meeting/type`,
        method: 'POST',
        version: '2.0',
        data: request
      })
      .then(res => ({ id: res.typeId.toString() }));
  }

  /**
   * Patch meeting type.
   * Permissions: Admin
   *
   * @param request must implement UpdateMeetingTypeRequest
   * @return Promise<Entity> Type ID
   */
  public update(request: UpdateMeetingTypeRequest): Promise<Entity> {
    return this.apiService
      .request({
        endpoint: `/meeting/type/${request.typeId}`,
        method: 'PATCH',
        version: '2.0',
        data: request
      })
      .then(res => ({ id: res.typeId.toString() }));
  }

  /**
   * Update meeting type.
   * Permissions: Admin
   *
   * @param request must implement PutMeetingTypeRequest
   * @return Promise<Entity> Type ID
   */
  public put(request: PutMeetingTypeRequest): Promise<Entity> {
    return this.apiService
      .request({
        endpoint: `/meeting/type/${request.typeId}`,
        method: 'PUT',
        version: '2.0',
        data: request
      })
      .then(res => ({ id: res.typeId.toString() }));
  }

  /**
   * Fetch meeting types.
   *
   * @param [request] must implement GetAllMeetingTypeRequest
   * @return Promise<GetAllMeetingTypeResponse>
   */
  public getAll(request?: GetAllMeetingTypeRequest): Promise<GetAllMeetingTypeResponse> {
    return this.apiService.request({
      endpoint: `/meeting/type`,
      method: 'GET',
      version: '2.0',
      data: request
    });
  }

  /**
   * Fetch single meeting type.
   *
   * @param request must implement GetSingleMeetingTypeRequest
   * @return Promise<MeetingTypeSingle>
   */
  public getSingle(request: GetSingleMeetingTypeRequest): Promise<MeetingTypeSingle> {
    return this.apiService.request({
      endpoint: `/meeting/type/${request.typeId}`,
      method: 'GET',
      version: '2.0'
    });
  }
}
