import { Injectable } from '@angular/core';
import { ApiService } from '../../api.service';

import { Entity } from '../../shared';
import {
  CreateNoteConsultationRequest,
  GetAllNoteConsultationRequest,
  UpdateNoteConsultationRequest
} from './requests';
import { GetAllNoteConsultationResponse } from './responses';

@Injectable({
  providedIn: 'root'
})
export class NoteConsultation {
  public constructor(private readonly apiService: ApiService) {}

  /**
   * Add consultation notes for a user.
   * Permissions: Provider, Client, OrgAccess, OrgClientPHI
   *
   * @param request must implement CreateNoteConsultationRequest
   * @return Promise<Entity>
   */
  public create(request: CreateNoteConsultationRequest): Promise<Entity> {
    return this.apiService.request({
      endpoint: `/note/consultation`,
      method: 'POST',
      version: '2.0',
      data: request
    });
  }

  /**
   * Get consultation notes for an account.
   * Permissions: Provider, Client, OrgAccess, OrgClientPHI
   *
   * @param request must implement GetAllNoteConsultationRequest
   * @return Promise<GetAllNoteConsultationResponse>
   */
  public getAll(request: GetAllNoteConsultationRequest): Promise<GetAllNoteConsultationResponse> {
    return this.apiService.request({
      endpoint: `/note/consultation`,
      method: 'GET',
      version: '2.0',
      data: request
    });
  }

  /**
   * Get a single consultation note.
   * Permissions: Provider, Client, OrgAccess, OrgClientPHI
   *
   * @param request must implement Entity
   * @return Promise<Entity> The ID of the note
   */
  public getSingle(request: Entity): Promise<Entity> {
    return this.apiService
      .request({
        endpoint: `/note/consultation/${request.id}`,
        method: 'GET',
        version: '2.0'
      })
      .then(res => ({ id: res.noteId.toString() }));
  }

  /**
   * Update the consultation notes for a user.
   * Permissions: Provider, Client, OrgAccess, OrgClientPHI
   *
   * @param request must implement UpdateNoteConsultationRequest
   * @return Promise<void>
   */
  public update(request: UpdateNoteConsultationRequest): Promise<void> {
    return this.apiService.request({
      endpoint: `/note/consultation/${request.id}`,
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
      endpoint: `/note/consultation/${request.id}`,
      method: 'DELETE',
      version: '2.0'
    });
  }
}
