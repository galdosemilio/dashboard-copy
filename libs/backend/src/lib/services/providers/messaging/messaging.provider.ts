import { Injectable } from '@angular/core';
import { ApiService } from '../../api.service';

import { Entity } from '../../shared';
import {
  AddMessageMessagingRequest,
  CreateThreadMessagingRequest,
  GetAllMessagingRequest,
  GetThreadMessagingRequest,
  UpdateThreadMessagingRequest
} from './requests';
import {
  GetAllMessagingResponse,
  GetThreadMessagingResponse,
  GetUnreadMessagingResponse
} from './responses';

@Injectable({
  providedIn: 'root'
})
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
    });
  }

  /**
   * Fetch all threads that a single user is part of.
   * If you pass multiple accounts in the array it will search for threads with those users.
   * Permissions: Provider, Client
   *
   * @param [request] must implement GetAllMessagingRequest
   * @return Promise<GetAllMessagingResponse>
   */
  public getAll(request?: GetAllMessagingRequest): Promise<GetAllMessagingResponse> {
    return this.apiService.request({
      endpoint: `/message/thread`,
      method: 'GET',
      version: '2.0',
      data: request
    });
  }

  /**
   * Fetch single thread and the messages associated with the thread, set messages as viewed.
   * Permissions: Provider, Client
   *
   * @param request must implement GetThreadMessagingRequest
   * @return Promise<GetThreadMessagingResponse>
   */
  public getThread(request: GetThreadMessagingRequest): Promise<GetThreadMessagingResponse> {
    return this.apiService.request({
      endpoint: `/message/thread/${request.threadId}`,
      method: 'GET',
      version: '2.0',
      data: request
    });
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
    });
  }

  /**
   * Add new thread and pass accounts to be included into the thread.
   * Permissions: Provider, Client
   *
   * @param request must implement CreateThreadMessagingRequest
   * @return Promise<Entity>
   */
  public createThread(request: CreateThreadMessagingRequest): Promise<Entity> {
    return this.apiService.request({
      endpoint: `/message/thread`,
      method: 'POST',
      version: '2.0',
      data: request
    });
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
    });
  }
}
