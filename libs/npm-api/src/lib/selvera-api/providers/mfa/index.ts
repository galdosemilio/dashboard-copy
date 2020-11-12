import { ApiService } from '../../services'
import { Entity, ListResponse, NamedEntity } from '../common/entities'
import {
  CreateMFASectionRequest,
  CreateOrganizationMFARequest,
  CreateUserMFARequest,
  DeleteMFASectionRequest,
  DeleteUserMFARequest,
  GetMFAOrganizationPreferenceRequest,
  GetMFAPreferenceAggregate,
  GetUserMFARequest,
  UpdateMFASectionRequest,
  UpdateOrganizationMFARequest,
  VerifyUserMFARequest
} from './requests'
import { VerifyDeleteUserMFARequest } from './requests/verifyDeleteUserMFA.request'
import {
  CreateUserMFAResponse,
  DeleteUserMFAResponse,
  GetMFAOrganizationPreferenceResponse,
  GetMFAPreferenceAggregateResponse,
  GetMFASectionsResponse,
  GetUserMFAResponse
} from './responses'

/**
 * Multifactor Authentication Service
 */
class MFA {
  /**
   * Init API service
   * @param apiService
   */
  public constructor(private readonly apiService: ApiService) {}

  /**
   * Create an MFA section instance in an organization preference
   * @param request must implement CreateMFASectionRequest
   * @returns Promise<Entity>
   */
  public createMFASection(request: CreateMFASectionRequest): Promise<Entity> {
    return this.apiService.request({
      data: request,
      method: 'POST',
      endpoint: `/mfa/preference/${request.preference}/section`,
      version: '1.0'
    })
  }

  /**
   * Fetch aggregated union of strictest MFA preference settings for accounts
   * @param request must implement CreateOrganizationMFARequest
   * @returns Promise<GetMFASectionsResponse>
   */
  public getMFAPreferenceAggregate(
    request?: GetMFAPreferenceAggregate
  ): Promise<GetMFAPreferenceAggregateResponse> {
    return this.apiService.request({
      data: request,
      method: 'GET',
      endpoint: '/mfa/preference/aggregate',
      version: '1.0'
    })
  }

  /**
   * Create an MFA preference instance for an organization
   * @param request must implement CreateOrganizationMFARequest
   * @returns Promise<Entity>
   */
  public createOrganizationMFA(
    request: CreateOrganizationMFARequest
  ): Promise<Entity> {
    return this.apiService.request({
      data: request,
      method: 'POST',
      endpoint: '/mfa/preference',
      version: '1.0'
    })
  }

  /**
   * Creates an MFA channel instance for a user
   * @param request must implement CreateUserMFARequest
   * @returns Promise<CreateUserMFAResponse>
   */
  public createUserMFA(
    request: CreateUserMFARequest
  ): Promise<CreateUserMFAResponse> {
    return this.apiService.request({
      data: request,
      method: 'POST',
      endpoint: '/mfa',
      version: '1.0'
    })
  }

  /**
   * Deletes an MFA section instance from an MFA preference instance
   * @param request must implement DeleteMFASectionRequest
   * @returns Promise<void>
   */
  public deleteMFASection(request: DeleteMFASectionRequest): Promise<void> {
    return this.apiService.request({
      method: 'DELETE',
      endpoint: `/mfa/preference/${request.preference}/section/${request.id}`,
      version: '1.0'
    })
  }

  /**
   * Deletes an organization's MFA preference instance
   * @param request must implement Entity
   * @returns Promise<void>
   */
  public deleteOrganizationMFA(request: Entity): Promise<void> {
    return this.apiService.request({
      method: 'DELETE',
      endpoint: `/mfa/preference/${request.id}`,
      version: '1.0'
    })
  }

  /**
   * Deletes a user's MFA channel instance
   * @param request must implement DeleteUserMFARequest
   * @returns Promise<DeleteUserMFAResponse>
   */
  public deleteUserMFA(
    request: DeleteUserMFARequest
  ): Promise<DeleteUserMFAResponse | void> {
    return this.apiService.request({
      data: request,
      method: 'DELETE',
      endpoint: `/mfa/${request.id}`,
      version: '1.0'
    })
  }

  /**
   * Retrieves a list of backup codes from a user's MFA channel instance
   * @param request must implement Entity
   * @returns Promise<ListResponse<string>>
   */
  public getMFABackupCodes(request: Entity): Promise<ListResponse<string>> {
    return this.apiService.request({
      method: 'GET',
      endpoint: `/mfa/${request.id}/backup-code`,
      version: '1.0'
    })
  }

  /**
   * Retrieves a list of available MFA channels
   * @returns Promise<ListResponse<NamedEntity>>
   */
  public getMFAChannels(): Promise<ListResponse<NamedEntity>> {
    return this.apiService.request({
      method: 'GET',
      endpoint: '/mfa/channel',
      version: '1.0'
    })
  }

  /**
   * Retrieves a list of available MFA sections for an organization
   * @returns Promise<GetMFASectionsResponse>
   */
  public getMFASections(): Promise<GetMFASectionsResponse> {
    return this.apiService.request({
      method: 'GET',
      endpoint: '/mfa/preference/section',
      version: '1.0'
    })
  }

  /**
   * Retrieves an organization's MFA preference instance
   * @param request must implement GetMFAOrganizationPreferenceRequest
   * @returns Promise<GetMFAOrganizationPreferenceResponse>
   */
  public getOrganizationMFA(
    request: GetMFAOrganizationPreferenceRequest
  ): Promise<GetMFAOrganizationPreferenceResponse> {
    return this.apiService.request({
      data: request,
      method: 'GET',
      endpoint: '/mfa/preference',
      version: '1.0'
    })
  }

  /**
   * Retrieves a user's MFA channel instance
   * @param request must implement GetUserMFARequest
   */
  public getUserMFA(request: GetUserMFARequest): Promise<GetUserMFAResponse> {
    return this.apiService.request({
      data: request,
      method: 'GET',
      endpoint: '/mfa',
      version: '1.0'
    })
  }

  /**
   * Updates a section instance in an organization's MFA preference instance
   * @param request must implement UpdateMFASectionRequest
   * @returns Promise<void>
   */
  public updateMFASection(request: UpdateMFASectionRequest): Promise<void> {
    return this.apiService.request({
      data: request,
      method: 'PATCH',
      endpoint: `/mfa/preference/${request.preference}/section/${request.id}`,
      version: '1.0'
    })
  }

  /**
   * Updates an organization's MFA preference instance
   * @param request must implement UpdateOrganizationMFARequest
   * @returns Promise<void>
   */
  public updateOrganizationMFA(
    request: UpdateOrganizationMFARequest
  ): Promise<void> {
    return this.apiService.request({
      data: request,
      method: 'PATCH',
      endpoint: `/mfa/preference/${request.id}`,
      version: '1.0'
    })
  }

  /**
   * Verifies the deletion of a user's MFA channel
   * @param request must implement VerifyDeleteUserMFARequest
   * @returns Promise<void>
   */
  public verifyDeleteUserMFA(
    request: VerifyDeleteUserMFARequest
  ): Promise<void> {
    return this.apiService.request({
      data: request,
      method: 'DELETE',
      endpoint: `/mfa/${request.id}/mfa`,
      version: '1.0'
    })
  }

  /**
   * Verifies a recently-created MFA channel for a user
   * @param request must implement VerifyUserMFArequest
   * @returns Promise<void>
   */
  public verifyUserMFA(
    request: VerifyUserMFARequest
  ): Promise<ListResponse<string>> {
    return this.apiService.request({
      data: request,
      method: 'POST',
      endpoint: `/mfa/${request.id}/verify`,
      version: '1.0'
    })
  }
}

export { MFA }
