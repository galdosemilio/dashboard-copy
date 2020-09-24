import { Injectable } from '@angular/core';
import { ApiService } from '../../api.service';

import { Entity } from '../../shared';
import {
  CreateNoteGeneralRequest,
  GetAllNoteGeneralRequest,
  UpdateNoteGeneralRequest
} from './requests';
import { GetAllNoteGeneralResponse, NoteGeneralSingle } from './responses';

@Injectable({
  providedIn: 'root'
})
export class NoteGeneral {
  public constructor(private readonly apiService: ApiService) {}

  /**
   * Add general notes for a user.
   * Permissions: Provider, Client, OrgAccess, OrgClientPHI
   *
   * @param request must implement CreateNoteGeneralRequest
   * @return Promise<Entity>
   */
  public create(request: CreateNoteGeneralRequest): Promise<Entity> {
    return this.apiService.request({
      endpoint: `/note/general`,
      method: 'POST',
      version: '2.0',
      data: request
    });
  }

  /**
   * Get general notes for an account.
   * Permissions: Provider, Client, OrgAccess, OrgClientPHI
   *
   * @param [request] must implement GetAllNoteGeneralRequest
   * @return Promise<GetAllNoteGeneralResponse>
   */
  public getAll(request?: GetAllNoteGeneralRequest): Promise<GetAllNoteGeneralResponse> {
    return this.apiService.request({
      endpoint: `/note/general`,
      method: 'GET',
      version: '2.0',
      data: request
    });
  }

  /**
   * Get a single general note.
   * Permissions: Provider, Client, OrgAccess, OrgClientPHI
   *
   * @param request must implement Entity
   * @return Promise<NoteGeneralSingle>
   */
  public getSingle(request: Entity): Promise<NoteGeneralSingle> {
    return this.apiService.request({
      endpoint: `/note/general/${request.id}`,
      method: 'GET',
      version: '2.0'
    });
  }

  /**
   * Update the general notes for a user.
   * Permissions: Provider, Client, OrgAccess, OrgClientPHI
   *
   * @param request must implement UpdateNoteGeneralRequest
   * @return Promise<void>
   */
  public update(request: UpdateNoteGeneralRequest): Promise<void> {
    return this.apiService.request({
      endpoint: `/note/general/${request.id}`,
      method: 'PATCH',
      version: '2.0',
      data: request
    });
  }

  /**
   * Delete notes. Can only be performed by the note creator.
   * Permissions: Provider, Client, OrgAccess, OrgClientPHI
   *
   * @param request must implement Entity
   * @return Promise<void>
   */
  public delete(request: Entity): Promise<void> {
    return this.apiService.request({
      endpoint: `/note/general/${request.id}`,
      method: 'DELETE',
      version: '2.0'
    });
  }
}
