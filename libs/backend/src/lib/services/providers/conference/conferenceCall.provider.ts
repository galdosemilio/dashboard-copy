import { Injectable } from '@angular/core';
import { ApiService } from '../../api.service';

import { Entity } from '../../shared';
import {
  CreateConferenceCallRequest,
  CreateTokenConferenceCallRequest,
  EmitEventConferenceCallRequest,
  GetAllConferenceCallRequest,
  GetAvailabilityConferenceCallRequest,
  UpdateConferenceCallRequest
} from './requests';
import {
  ConferenceCallSingle,
  CreateTokenConferenceCallResponse,
  GetAllConferenceCallResponse,
  GetAvailabilityConferenceCallResponse
} from './responses';

@Injectable({
  providedIn: 'root'
})
export class ConferenceCall {
  public constructor(private readonly apiService: ApiService) {}

  /**
   * Creates an access token (JWT) to specified video conference call and adds the caller to the attending participants.
   * Permissions: Provider, Client
   *
   * @param request must implement CreateTokenConferenceCallRequest
   * @return Promise<CreateTokenConferenceCallResponse>
   */
  public createToken(
    request: CreateTokenConferenceCallRequest
  ): Promise<CreateTokenConferenceCallResponse> {
    return this.apiService.request({
      endpoint: `/conference/video/token`,
      method: 'POST',
      version: '2.0',
      data: request
    });
  }

  /**
   * Notifies of a specific event that happened during the call.
   * Permissions: Provider, Client
   *
   * @param request must implement EmitEventConferenceCallRequest
   * @return Promise<void>
   */
  public emitEvent(request: EmitEventConferenceCallRequest): Promise<void> {
    return this.apiService.request({
      endpoint: `/conference/video/call/event`,
      method: 'POST',
      version: '2.0',
      data: request
    });
  }

  /**
   * Creates a call metadata entry returning call id on success.
   * Permissions: Provider, Client
   *
   * @param request must implement CreateConferenceCallRequest
   * @return Promise<Entity> Id of created call entry
   */
  public create(request: CreateConferenceCallRequest): Promise<Entity> {
    return this.apiService
      .request({
        endpoint: `/conference/video/call`,
        method: 'POST',
        version: '2.0',
        data: request
      })
      .then(res => ({ id: res.callId.toString() }));
  }

  /**
   * Updates a call metadata entry. Only call initiator able to update call metadata.
   * Permissions: Provider, Cliebt
   *
   * @param request must implement UpdateConferenceCallRequest
   * @return Promise<void>
   */
  public update(request: UpdateConferenceCallRequest): Promise<void> {
    return this.apiService.request({
      endpoint: `/conference/video/call/${request.id}`,
      method: 'PATCH',
      version: '2.0',
      data: request
    });
  }

  /**
   * Get availability/on-call flag. If the flag is returned as `false`, it means the selected user is on another call.
   * This endpoint has account permission checks disabled.
   *
   * @param request must implement GetAvailabilityConferenceCallRequest
   * @return Promise<GetAvailabilityConferenceCallResponse>
   */
  public getAvailability(
    request: GetAvailabilityConferenceCallRequest
  ): Promise<GetAvailabilityConferenceCallResponse> {
    return this.apiService.request({
      endpoint: `/conference/video/call/availability`,
      method: 'GET',
      version: '2.0',
      data: request
    });
  }

  /**
   * Retrieves details of a single call.
   * Permissions: Provider, Client
   *
   * @param request must implement Entity
   * @return Promise<ConferenceCallSingle>
   */
  public getSingle(request: Entity): Promise<ConferenceCallSingle> {
    return this.apiService.request({
      endpoint: `/conference/video/call/${request.id}`,
      method: 'GET',
      version: '2.0'
    });
  }

  /**
   * Retrieve paged call entries.
   * Permissions: Provider, Client
   *
   * @param request must implement GetAllConferenceCallRequest
   * @return Promise<GetAllConferenceCallResponse>
   */
  public getAll(request: GetAllConferenceCallRequest): Promise<GetAllConferenceCallResponse> {
    return this.apiService.request({
      endpoint: `/conference/video/call`,
      method: 'GET',
      version: '2.0',
      data: request
    });
  }
}
