import { ApiService } from '../../services/api.service'

import { Entity } from '../common/entities'
import {
  AddMessageMessagingRequest,
  CreateThreadMessagingRequest,
  DeleteMessageDraftRequest,
  GetAllMessagingRequest,
  GetMessageActivitySummaryRequest,
  GetMessageDraftRequest,
  GetThreadMessagingRequest,
  MarkAllMessagesAsViewedRequest,
  UpdateAccountThreadAssociation,
  UpdateThreadMessagingRequest,
  UpsertMessageDraftRequest
} from './requests'
import {
  GetAllMessagingResponse,
  GetThreadMessagingResponse,
  GetUnreadMessagingResponse
} from './responses'
import { GetMessageActivitySummaryResponse } from './responses/getActivitySummary.response'

export class Messaging {
  public constructor(private readonly apiService: ApiService) {}

  /**
   * Add message to thread.
   * Permissions: Provider, Client
   *
   * @param request must implement AddMessageMessagingRequest
   * @return Promise<void>
   */
  public addMessage(request: AddMessageMessagingRequest): Promise<void> {
    return this.apiService.request({
      endpoint: `/message`,
      method: 'POST',
      version: '2.0',
      data: request
    })
  }

  /**
   * Generates a messaging activity summary
   * @param request must implement GetActivitySummaryRequest
   * @returns Promise<GetActivitySummaryResponse>
   */
  public getActivitySummary(
    request: GetMessageActivitySummaryRequest
  ): Promise<GetMessageActivitySummaryResponse> {
    return this.apiService.request({
      endpoint: '/message/activity-summary',
      method: 'GET',
      version: '1.0',
      data: request
    })
  }

  /**
   * Fetch all threads that a single user is part of.
   * If you pass multiple accounts in the array it will search for threads with those users.
   * Permissions: Provider, Client
   *
   * @param request must implement GetAllMessagingRequest
   * @return Promise<GetAllMessagingResponse>
   */
  public getAll(
    request: GetAllMessagingRequest
  ): Promise<GetAllMessagingResponse> {
    return this.apiService.request({
      endpoint: `/message/thread`,
      method: 'GET',
      version: '2.0',
      data: request
    })
  }

  /**
   * Fetch single thread and the messages associated with the thread, set messages as viewed.
   * Permissions: Provider, Client
   *
   * @param request must implement GetThreadMessagingRequest
   * @return Promise<GetThreadMessagingResponse>
   */
  public getThread(
    request: GetThreadMessagingRequest
  ): Promise<GetThreadMessagingResponse> {
    return this.apiService.request({
      endpoint: `/message/thread/${request.threadId}`,
      method: 'GET',
      version: '2.0',
      data: request
    })
  }

  /**
   * Fetch the number of unread threads and unread messages.
   * Permissions: Provider, Client
   *
   * @return Promise<GetUnreadMessagingResponse>
   */
  public getUnread(): Promise<GetUnreadMessagingResponse> {
    return this.apiService.request({
      endpoint: `/message/unread`,
      method: 'GET',
      version: '2.0'
    })
  }

  /**
   * Add new thread and pass accounts to be included into the thread.
   * Permissions: Provider, Client
   *
   * @param request must implement CreateThreadMessagingRequest
   * @return Promise<Entity> The id of the newly created record
   */
  public createThread(request: CreateThreadMessagingRequest): Promise<Entity> {
    return this.apiService
      .request({
        endpoint: `/message/thread`,
        method: 'POST',
        version: '2.0',
        data: request
      })
      .then((res) => ({ id: res.threadId.toString() }))
  }

  /**
   * Toggle thread archivization for an account.
   * Permissions: Provider, Client
   *
   * @param request must implement UpdateThreadMessagingRequest
   * @return Promise<void>
   */
  public updateThread(request: UpdateThreadMessagingRequest): Promise<void> {
    return this.apiService.request({
      endpoint: `/message/thread/${request.threadId}/${request.account}`,
      method: 'PATCH',
      version: '2.0',
      data: request
    })
  }

  /**
   * Creates an autosaved draft for a feature. An existing draft will be overwritten.
   * @param request must implement UpsertMessageDraftRequest
   * @returns Promise<void>
   */
  public upsertDraft(request: UpsertMessageDraftRequest): Promise<any> {
    return this.apiService.request({
      endpoint: `/message/draft`,
      method: 'PUT',
      version: '1.0',
      data: request
    })
  }

  /**
   * Get the autosaved draft
   * @param request must implement GetMessageDraftRequest
   * @returns Promise<any>
   */
  public getDraft(request: GetMessageDraftRequest): Promise<any> {
    return this.apiService.request({
      endpoint: `/message/draft`,
      method: 'GET',
      version: '1.0',
      data: request
    })
  }

  /**
   * Remove the autosaved draft
   * @param request must implement DeleteMessageDraftRequest
   * @returns Promise<void>
   */
  public deleteDraft(request: DeleteMessageDraftRequest): Promise<void> {
    return this.apiService.request({
      endpoint: `/message/draft`,
      method: 'DELETE',
      version: '1.0',
      data: request
    })
  }

  /**
   * Marks all messages as viewed
   * @param request must implement MarkAllMessagesAsViewedRequest
   * @returns Promise<void>
   */
  public markAllMessagesAsViewed(
    request: MarkAllMessagesAsViewedRequest
  ): Promise<void> {
    return this.apiService.request({
      endpoint: `/message/viewed`,
      method: 'POST',
      version: '2.0',
      data: request
    })
  }

  /**
   * Add permission to a user to have access to a thread
   * @param request must implement AddThreadPermissionRequest
   * @returns Promise<void>
   */
  public addThreadPermission(request: any): Promise<void> {
    return this.apiService.request({
      endpoint: `/message/permission`,
      method: 'POST',
      version: '2.0',
      data: request
    })
  }

  /**
   * Edit thread-account association
   * @param request must implement Acco
   * @returns Promise<void>
   */
  public updateAccountThreadAssociation(
    request: UpdateAccountThreadAssociation
  ): Promise<void> {
    return this.apiService.request({
      endpoint: `/message/thread/${request.threadId}/${request.account}`,
      method: 'PATCH',
      version: '2.0',
      data: request
    })
  }
}
