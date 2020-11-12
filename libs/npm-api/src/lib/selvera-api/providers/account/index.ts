import {
  AccActivityRequest,
  AccAddRequest,
  AccCheckRequest,
  AccListAllRequest,
  AccListRequest,
  AccPreferencesRequest,
  AccUpdatePasswordMFARequest,
  AccUpdatePasswordRequest,
  AccUpdateRequest,
  AvatarSubmitRequest,
  CreateAccountRequest,
  GetLoginHistoryRequest,
  SetActiveAccountRequest
} from '../../providers/account/requests'
import {
  AccAddResponse,
  AccListAllResponse,
  AccListResponse,
  AccPreferencesResponse,
  AccSingleResponse,
  FetchAccountPreference,
  GetTitlesAccountResponse,
  GetTypesAccountResponse
} from '../../providers/account/responses'
import { ApiService } from '../../services/api.service'
import { Entity } from '../common/entities'
import { PagedResponse } from '../content/entities'
import { AccountActivityEvent, LoginHistoryItem } from './entities'

/**
 * Account posting/getting/updating v2
 */
class Account {
  /**
   * Init Api Service
   */
  public constructor(private readonly apiService: ApiService) {}

  /**
   * Activate an account. Only admin users have permission to this endpoint
   * @param accountId Account ID
   * @returns Promise<void>
   */
  public activate(accountId: string): Promise<void> {
    const accActivityRequest: AccActivityRequest = {
      account: accountId,
      isActive: true
    }
    return this.apiService.request({
      endpoint: `/account/${accActivityRequest.account}/activity`,
      method: 'PATCH',
      data: accActivityRequest,
      version: '2.0'
    })
  }

  /**
   * Creates a new account. Password for the account is generated automatically
   * @param accAddRequest must implement AccAddRequest
   * @returns Promise<AccAddResponse>
   */
  public add(accAddRequest: AccAddRequest): Promise<AccAddResponse> {
    return this.apiService.request({
      endpoint: '/account',
      method: 'POST',
      data: accAddRequest,
      version: '2.0'
    })
  }

  /**
   * Emits a user activity event for a logged in user.
   * @param request must implement AccountActivityEvent
   * @returns Promise<AccountActivityEvent>
   */
  public addActivityEvent(
    request: AccountActivityEvent
  ): Promise<AccountActivityEvent> {
    return this.apiService.request({
      endpoint: '/account/activity/event',
      method: 'POST',
      data: request,
      version: '1.0'
    })
  }

  /**
   * Check if an account exists
   * @param accCheckRequest must implement AccCheckRequest
   * @returns Promise<void>
   */
  public check(accCheckRequest: AccCheckRequest): Promise<void> {
    return this.apiService.request({
      endpoint: '/account?email=' + encodeURIComponent(accCheckRequest.email),
      method: 'HEAD',
      data: accCheckRequest,
      version: '2.0'
    })
  }

  /*
   * Creates a new account. Password for the account is generated automatically.
   * Permissions: Admin, Provider, OrgAdmin
   *
   * @param request must implement CreateAccountRequest
   * @return Promise<Entity>
   */
  public create(request: CreateAccountRequest): Promise<Entity> {
    return this.apiService.request({
      endpoint: `/account`,
      method: 'POST',
      version: '2.0',
      data: request
    })
  }

  /**
   * Set an account to inactive. Only admin users have permission to this endpoint
   * @param accountId Account ID
   * @returns Promise<void>
   */
  public deactivate(accountId: string): Promise<void> {
    const accActivityRequest: AccActivityRequest = {
      account: accountId,
      isActive: false
    }
    return this.apiService.request({
      endpoint: `/account/${accActivityRequest.account}/activity`,
      method: 'PATCH',
      data: accActivityRequest,
      version: '2.0'
    })
  }

  /**
   * Removes the profile picture for specified account
   * @param accountId Account ID
   * @returns Promise<void>
   */
  public deleteAvatar(accountId: string): Promise<void> {
    return this.apiService.request({
      endpoint: `/account/${accountId}/avatar`,
      method: 'DELETE',
      version: '2.0'
    })
  }

  /**
   * Retrieves a profile picture for specified account. Returns a raw buffer image content.
   * @param clientId Client ID
   * @returns void
   */
  public fetchAvatar(clientId: string): Promise<void> {
    return this.apiService.request({
      endpoint: `/account/${clientId}/avatar`,
      method: 'GET',
      version: '2.0'
    })
  }

  /**
   * Retrieves a the preferences for specified account.
   * @param accountId Account ID
   * @returns void
   */
  public fetchPreferences(accountId: string): Promise<FetchAccountPreference> {
    return (
      this.apiService
        .request({
          endpoint: `/account/${accountId}/preference`,
          method: 'GET',
          version: '2.0'
        })
        // return empty preferences if it's not found
        .catch((err) =>
          err === 'Endpoint not found' ? {} : Promise.reject(err)
        )
    )
  }

  /**
   * Fetch listing of user accounts. Restricted to admins
   * @param accListAllRequest must implement AccListAllRequest
   * @returns Promise<AccListAllResponse>
   */
  public getAll(
    accListAllRequest: AccListAllRequest
  ): Promise<AccListAllResponse> {
    return this.apiService.request({
      endpoint: '/account',
      method: 'GET',
      data: accListAllRequest,
      version: '2.0'
    })
  }

  /**
   * Retrieves a profile picture for specified account. Returns a raw buffer image content
   * @param accountId Account ID
   * @returns Promise<string>
   */
  public getAvatar(accountId: string): Promise<string> {
    return this.apiService.request({
      endpoint: `/account/${accountId}/avatar`,
      method: 'GET',
      version: '3.0'
    })
  }

  /**
   * Get a listing of accessible accounts for an account
   * @param accListRequest must implement AccListRequest
   * @returns Promise<AccListResponse>
   */
  public getList(accListRequest: AccListRequest): Promise<AccListResponse> {
    return this.apiService.request({
      endpoint: '/access/account',
      method: 'GET',
      data: accListRequest,
      version: '2.0'
    })
  }

  /**
   * Fetches a paginated list of login history entries for an account.
   * @param request must implement GetLoginHistoryRequest
   * @returns PagedResponse<LoginHistoryItem>
   */
  public getLoginHistory(
    request: GetLoginHistoryRequest
  ): Promise<PagedResponse<LoginHistoryItem>> {
    return this.apiService.request({
      data: request,
      endpoint: `/account/${request.account}/login-history`,
      method: 'GET',
      version: '1.0'
    })
  }

  /**
   * Retrieves an account preferences
   * @param accountId Account ID
   * @returns Promise<AccPreferenceReponse>
   */
  public getPreferences(accountId: string): Promise<AccPreferencesResponse> {
    return this.apiService.request({
      endpoint: `/account/${accountId}/preference`,
      method: 'GET',
      version: '2.0'
    })
  }

  /**
   * Fetch single account data
   * @param id mixed requested account ID
   * @returns Promise<AccSingleResponse>
   */
  public getSingle(id: string | number): Promise<AccSingleResponse> {
    return this.apiService.request({
      endpoint: `/account/${id}`,
      method: 'GET',
      version: '2.0'
    })
  }

  /**
   * Get the listing of all titles in the system. Restricted to Admins and Providers.
   * Permissions: Admin, Provider
   *
   * @return Promise<GetTitlesAccountResponse>
   */
  public getTitles(): Promise<GetTitlesAccountResponse> {
    return this.apiService.request({
      endpoint: `/account-title`,
      method: 'GET',
      version: '2.0'
    })
  }

  /**
   * Get the listing of all user types in the system. Restricted to Admins and Providers.
   * Permissions: Admin, Provider
   *
   * @return Promise<GetTypesAccountResponse>
   */
  public getTypes(): Promise<GetTypesAccountResponse> {
    return this.apiService.request({
      endpoint: `/account-type`,
      method: 'GET',
      version: '2.0'
    })
  }

  /**
   * Creates preference entry for specified account
   * @param accSavePreferencesRequest must implement AccPreferencesRequest
   * @returns Promise<void>
   */
  public savePreferences(
    accSavePreferencesRequest: AccPreferencesRequest
  ): Promise<void> {
    const account = accSavePreferencesRequest.account
    delete accSavePreferencesRequest.account

    return this.apiService.request({
      endpoint: `/account/${account}/preference`,
      method: 'POST',
      data: accSavePreferencesRequest,
      version: '2.0'
    })
  }

  /**
   * Creates or updates the profile picture for specified account
   * @param avatarSubmitRequest must implement AccSubmitAvatarRequest
   * @returns Promise<void>
   */
  public submitAvatar(avatarSubmitRequest: AvatarSubmitRequest): Promise<void> {
    return this.apiService.request({
      endpoint: `/account/${avatarSubmitRequest.client}/avatar`,
      method: 'PUT',
      data: avatarSubmitRequest,
      version: '2.0'
    })
  }

  /**
   * Update basic account data
   * @param accUpdateRequest must implement AccUpdateRequest
   * @returns Promise<boolean>
   */
  public update(accUpdateRequest: AccUpdateRequest): Promise<boolean> {
    return this.apiService.request({
      endpoint: `/account/${accUpdateRequest.id}`,
      method: 'PATCH',
      data: accUpdateRequest,
      version: '2.0'
    })
  }

  /**
   * Update account password
   * @param accUpdatePasswordRequest must implement accUpdatePasswordRequest
   * @returns Promise<void>
   */
  public updatePassword(
    accUpdatePasswordRequest: AccUpdatePasswordRequest
  ): Promise<void> {
    return this.apiService.request({
      endpoint: `/account/password`,
      method: 'POST',
      data: accUpdatePasswordRequest,
      version: '2.0'
    })
  }

  /**
   * Change password of currently authenticated account using MFA token
   * @param accUpdatePasswordMFARequest must implement accUpdatePasswordMFARequest
   * @returns Promise<void>
   */
  public updatePasswordMFA(
    accUpdatePasswordMFARequest: AccUpdatePasswordMFARequest
  ): Promise<void> {
    return this.apiService.request({
      endpoint: `/account/password/mfa`,
      method: 'POST',
      data: accUpdatePasswordMFARequest,
      version: '2.0'
    })
  }

  /**
   * Updates preference entry for specified account
   * @param accUpdatePreferencesRequest must implement AccPreferencesRequest
   * @returns Promise<boolean>
   */
  public updatePreferences(
    accUpdatePreferencesRequest: AccPreferencesRequest
  ): Promise<boolean> {
    const account = accUpdatePreferencesRequest.account
    delete accUpdatePreferencesRequest.account

    return this.apiService.request({
      endpoint: `/account/${account}/preference`,
      method: 'PATCH',
      data: accUpdatePreferencesRequest,
      version: '2.0'
    })
  }

  /**
   * Upload the profile picture for specified account
   * @param accountId Account ID
   * @returns Promise<string>
   */
  public uploadAvatar(accountId: string): Promise<string> {
    return this.apiService.request({
      endpoint: `/account/${accountId}/avatar/upload`,
      method: 'POST',
      version: '3.0'
    })
  }

  /**
   * Set an account to active/inactive. Deactivates all associations and assignments along with account deactivation.
   * Only admin users have permission to this endpoint.
   * Permissions: Admin
   *
   * @param request must implement SetActiveAccountRequest
   * @return Promise<void>
   */
  public setActive(request: SetActiveAccountRequest): Promise<void> {
    return this.apiService.request({
      endpoint: `/account/${request.id}/activity`,
      method: 'PATCH',
      version: '2.0',
      data: request
    })
  }
}

export { Account }
