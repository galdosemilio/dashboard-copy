import { ApiService } from '../../services/api.service'
import { Entity } from '../common/entities'
import { MessagingOrgPreference } from './entities'
import {
  CreateAccountMessagingPreferenceRequest,
  CreateOrgPreferenceRequest,
  DeletePreferenceRequest,
  GetAccountPreferenceRequest,
  GetOrgAutoThreadListingRequest,
  GetOrgPreferenceRequest,
  GetSingleAccountPreferenceRequest,
  ModifyAutoThreadParticipantRequest,
  UpdateAccountMessagingPreferenceRequest,
  UpdateMessagingOrgPreferenceRequest
} from './requests'
import {
  CreateAccountPreferenceResponse,
  GetAccountPreferenceResponse,
  GetOrgAutoThreadParticipantListingResponse,
  GetSingleAccountPreferenceResponse
} from './responses'

export class MessagingPreference {
  public constructor(private readonly apiService: ApiService) {}

  /**
   * Get listing of automatic thread participants for a particular org.
   * Permissions: Provider, OrgAccess
   *
   * @param request must implement GetOrgPreferenceRequest
   * @return Promise<GetOrgAutoThreadParticipantListingResponse> The listing of participants
   */
  public getOrgThreadAutoParticipants(
    request: GetOrgAutoThreadListingRequest
  ): Promise<GetOrgAutoThreadParticipantListingResponse> {
    return this.apiService.request({
      data: request,
      endpoint: `/message/preference/organization/${request.id}/auto-participation`,
      method: 'GET',
      version: '1.0'
    })
  }

  /**
   * Add participant in automatic thread participants listing for a specific preference.
   * Permissions: Provider, OrgAccess
   *
   * @param request must implement ModifyAutoThreadParticipantRequest
   * @return Promise<void>
   */
  public addThreadAutoParticipant(
    request: ModifyAutoThreadParticipantRequest
  ): Promise<void> {
    return this.apiService.request({
      data: request,
      endpoint: `/message/preference/organization/${request.id}/auto-participation`,
      method: 'PUT',
      version: '1.0'
    })
  }

  /**
   * Delete participant in automatic thread participants listing for a specific preference.
   * Permissions: Provider, OrgAccess
   *
   * @param request must implement ModifyAutoThreadParticipantRequest
   * @return Promise<void>
   */
  public deleteThreadAutoParticipant(
    request: ModifyAutoThreadParticipantRequest
  ): Promise<void> {
    return this.apiService.request({
      data: request,
      endpoint: `/message/preference/organization/${request.id}/auto-participation/${request.account}`,
      method: 'DELETE',
      version: '1.0'
    })
  }

  /**
   * Add notification preference for an account and organization.
   * Permissions: Provider, OrgAccess, Client
   *
   * @param request must implement CreateAccountPreferenceRequest
   * @return Promise<Entity> The id of the newly created record
   */

  public createAccountPreference(
    request: CreateAccountMessagingPreferenceRequest
  ): Promise<CreateAccountPreferenceResponse> {
    return this.apiService.request({
      endpoint: `/message/preference/account/${request.account}/organization/${request.organization}`,
      method: 'POST',
      version: '1.0',
      data: request
    })
  }

  /**
   * Create a Preference entry for an Organization
   * @param request must implement CreateOrgPreferenceRequest
   * @returns Promise<Entity>
   */
  public createOrgPreference(
    request: CreateOrgPreferenceRequest
  ): Promise<Entity> {
    return this.apiService.request({
      data: request,
      endpoint: '/message/preference/organization',
      method: 'POST',
      version: '1.0'
    })
  }

  public createPreference(
    request: CreateOrgPreferenceRequest
  ): Promise<Entity> {
    return this.apiService.request({
      data: request,
      endpoint: '/message/preference/organization',
      method: 'POST',
      version: '1.0'
    })
  }

  /**
   * Remove notification preference
   * Permissions: Provider, OrgAccess, Client
   *
   * @param request must implement DeletePreferenceRequest
   * @return Promise<void>
   */

  public deletePreference(request: DeletePreferenceRequest): Promise<void> {
    return this.apiService.request({
      endpoint: `/message/preference/account/${request.id}`,
      method: 'DELETE',
      version: '1.0',
      data: request
    })
  }

  /**
   * Remove an Organization Preference by ID
   * @param request must implement Entity
   * @returns Promise<void>
   */
  public deleteOrgPreference(request: Entity): Promise<void> {
    return this.apiService.request({
      data: request,
      endpoint: `/message/preference/organization/${request.id}`,
      method: 'DELETE',
      version: '1.0'
    })
  }

  public deleteMessagePreference(request: Entity): Promise<void> {
    return this.apiService.request({
      data: request,
      endpoint: `/message/preference/organization/${request.id}`,
      method: 'DELETE',
      version: '1.0'
    })
  }

  /**
   * Retrieve notification preference for an account.
   * Permissions: Provider, OrgAccess, Client
   *
   * @param request must implement GetAccountPreferenceRequest
   * @return Promise<Entity> The id of the newly created record
   */

  public getAccountPreference(
    request: GetAccountPreferenceRequest
  ): Promise<GetAccountPreferenceResponse> {
    return this.apiService.request({
      endpoint: `/message/preference/account`,
      method: 'GET',
      version: '1.0',
      data: request
    })
  }

  /**
   * Get Organization Preference
   * @param request must implement GetOrgPreferenceRequest
   * @returns Promise<MessagingOrgPreference>
   */
  public getOrgPreference(
    request: GetOrgPreferenceRequest
  ): Promise<MessagingOrgPreference> {
    return this.apiService.request({
      data: request,
      endpoint: '/message/preference/organization',
      method: 'GET',
      version: '1.0'
    })
  }

  /**
   * Get an Organization Preference by ID
   * @param request must implement Entity
   * @returns Promise<MessagingOrgPreference>
   */
  public getOrgPreferenceById(
    request: Entity
  ): Promise<MessagingOrgPreference> {
    return this.apiService.request({
      data: request,
      endpoint: `/message/preference/organization/${request.id}`,
      method: 'GET',
      version: '1.0'
    })
  }

  public getPreferenceByOrg(
    request: GetOrgPreferenceRequest
  ): Promise<MessagingOrgPreference> {
    return this.apiService.request({
      data: request,
      endpoint: '/message/preference/organization',
      method: 'GET',
      version: '1.0'
    })
  }

  /**
   * Retrieve notification preference by id.
   * Permissions: Provider, OrgAccess, Client
   *
   * @param request must implement GetSingleAccountPreferenceRequest
   * @return Promise<Entity> The id of the newly created record
   */

  public getSingleAccountPreference(
    request: GetSingleAccountPreferenceRequest
  ): Promise<GetSingleAccountPreferenceResponse> {
    return this.apiService.request({
      endpoint: `/message/preference/account/${request.id}`,
      method: 'GET',
      version: '1.0',
      data: request
    })
  }

  /**
   * Update notification preference
   * Permissions: Provider, OrgAccess, Client
   *
   * @param request must implement UpdateAccountPreferenceRequest
   * @return Promise<void>
   */

  public updateAccountPreference(
    request: UpdateAccountMessagingPreferenceRequest
  ): Promise<void> {
    return this.apiService.request({
      endpoint: `/message/preference/account/${request.id}`,
      method: 'PATCH',
      version: '1.0',
      data: request
    })
  }

  /**
   * Update Organization Preference ID
   * @param request must implement UpdateMessagingOrgPreferenceRequest
   * @returns Promise<void>
   */
  public updateOrgPreference(
    request: UpdateMessagingOrgPreferenceRequest
  ): Promise<void> {
    return this.apiService.request({
      data: request,
      endpoint: `/message/preference/organization/${request.id}`,
      method: 'PATCH',
      version: '1.0'
    })
  }

  public updatePreference(
    request: UpdateMessagingOrgPreferenceRequest
  ): Promise<void> {
    return this.apiService.request({
      data: request,
      endpoint: `/message/preference/organization/${request.id}`,
      method: 'PATCH',
      version: '1.0'
    })
  }
}
