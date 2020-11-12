import { BehaviorSubject } from 'rxjs'

import { ApiService } from '../../services'
import { AddResponse } from '../foodKey/responses'
import {
  CallAborted,
  CallDeclined,
  initialCallAborted,
  initialCallDeclined,
  initialRoom,
  Room
} from './models'
import {
  CreateCallRequest,
  CreateSubaccountRequest,
  FetchAllSubaccountsRequest,
  FetchCallAvailabilityRequest,
  FetchCallDetailsRequest,
  FetchCallsRequest,
  NotifyCallEventRequest,
  UpdateCallRequest,
  VideoTokenRequest
} from './requests'
import {
  Call,
  CreateCallResponse,
  FetchAllSubaccountsResponse,
  FetchCallAvailabilityResponse,
  FetchCallDetailsResponse,
  FetchCallsResponse,
  FetchSubaccountResponse,
  VideoTokenResponse
} from './responses'

/**
 * Conferencing management
 */
class Conference {
  /**
   * Init Api Service
   */

  public room$ = new BehaviorSubject<Room>(initialRoom)
  public callDeclined$ = new BehaviorSubject<CallDeclined>(initialCallDeclined)
  public callAborted$ = new BehaviorSubject<CallAborted>(initialCallAborted)

  public constructor(private readonly apiService: ApiService) {}

  public listenForCallNotifications() {
    const socketClient = this.apiService.getSocketClient()

    socketClient.on('notification', (message: any) => {
      switch (message.type) {
        case 'new-video-call':
          this.room$.next(message)
          break
        case 'video-call-aborted':
          this.callAborted$.next(message)
          break
        case 'video-call-declined':
          this.callDeclined$.next(message)
          break
      }
    })
  }

  /**
   * Fetch a video conference room access token
   */
  public fetchToken(request: VideoTokenRequest): Promise<VideoTokenResponse> {
    return this.apiService.request({
      endpoint: '/conference/video/token',
      method: 'POST',
      data: request,
      version: '2.0'
    })
  }

  /**
   * Fetch calls
   */
  public fetchCalls(request: FetchCallsRequest): Promise<FetchCallsResponse> {
    return this.apiService.request({
      endpoint: '/conference/video/call',
      method: 'GET',
      data: request,
      version: '3.0'
    })
  }

  /**
   * Save Call
   */
  public saveCall(request: CreateCallRequest): Promise<CreateCallResponse> {
    return this.apiService.request({
      endpoint: '/conference/video/call',
      method: 'POST',
      data: request,
      version: '2.0'
    })
  }

  /**
   * Update Call
   */
  public updateCall(request: UpdateCallRequest): Promise<void> {
    return this.apiService.request({
      endpoint: `/conference/video/call/${request.callId}`,
      method: 'PATCH',
      data: request,
      version: '2.0'
    })
  }

  /**
   * Retrieves call details
   */
  public fetchCallDetail(
    request: FetchCallDetailsRequest
  ): Promise<FetchCallDetailsResponse> {
    return this.apiService.request({
      endpoint: `/conference/video/call/${request.callId}`,
      method: 'GET',
      version: '2.0'
    })
  }

  /**
   * Retrieves all subaccounts for a specified organization
   */
  public fetchAllSubaccounts(
    request: FetchAllSubaccountsRequest
  ): Promise<FetchAllSubaccountsResponse> {
    return this.apiService.request({
      endpoint: `/conference/subaccount`,
      method: 'GET',
      data: request
    })
  }

  /**
   * Retrieves details of a single subaccount
   */
  public fetchSubaccount(id: string): Promise<FetchSubaccountResponse> {
    return this.apiService.request({
      endpoint: `/conference/subaccount?organization=${id}&isActive=true`,
      method: 'GET'
    })
  }

  /**
   * Retrieves user availability for a call
   */
  public fetchCallAvailability(
    request: FetchCallAvailabilityRequest
  ): Promise<FetchCallAvailabilityResponse> {
    return this.apiService.request({
      endpoint: `/conference/video/call/availability`,
      method: 'GET',
      data: request,
      version: '2.0'
    })
  }

  /**
   * Add a subaccount for a specified organization
   */
  public createSubaccount(
    request: CreateSubaccountRequest
  ): Promise<AddResponse> {
    return this.apiService
      .request({
        endpoint: '/conference/subaccount',
        method: 'POST',
        data: request
      })
      .then((res) => ({
        id: String(res.id)
      }))
  }

  /**
   * Removes a subaccount
   */
  public deleteSubaccount(id: string): Promise<boolean> {
    return this.apiService.request({
      endpoint: `/conference/subaccount/${id}`,
      method: 'DELETE'
    })
  }

  /**
   * Notify call participants of recipient action
   */
  public notifyEvent(request: NotifyCallEventRequest): Promise<void> {
    return this.apiService.request({
      endpoint: `/conference/video/call/event`,
      method: 'POST',
      data: request,
      version: '2.0'
    })
  }

  /**
   * Attempt to close opened call
   * @param callId
   */
  public attemptCloseCall(callId: string): Promise<void> {
    return this.apiService.request({
      endpoint: `/conference/video/call/${callId}/end`,
      method: 'POST',
      version: '2.0'
    })
  }
}

export { Conference }
