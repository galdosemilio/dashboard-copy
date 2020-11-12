import { ApiService } from '../../services/api.service'
import { AccountKeyEntryEntity } from './entities'
import {
  AddAccountKeyRequest,
  AddConsumedKeyRequest,
  AddKeyRequest,
  AddOrganizationKeyRequest,
  FetchAllAccountKeyRequest,
  FetchAllConsumedKeyRequest,
  FetchAllKeyRequest,
  FetchAllOrganizationKeyRequest,
  UpdateAccountKeyRequest,
  UpdateConsumedKeyRequest,
  UpdateKeyRequest,
  UpdateOrganizationKeyRequest
} from './requests'
import {
  AddResponse,
  ConsumedKeyResponse,
  FetchAllConsumedKeyResponse,
  FetchAllKeyResponse,
  FetchAllOrganizationKeyResponse,
  FetchSingleAccountKeyResponse,
  FetchSingleOrganizationKeyResponse
} from './responses'

/**
 * Key-based food consumption
 */
class FoodKey {
  public constructor(private readonly apiService: ApiService) {}

  /**
   * Fetch all available keys [Admin]
   * @param request FetchAllKeyRequest
   * @returns Promise<FetchAllKeyResponse>
   */
  public fetchAll(request?: FetchAllKeyRequest): Promise<FetchAllKeyResponse> {
    return this.apiService.request({
      endpoint: '/key',
      method: 'GET',
      data: request,
      version: '2.0'
    })
  }

  /**
   * Create new key entry [Admin]
   * @param request must implement AddKeyRequest
   * @returns Promise<AddResponse>
   */
  public add(request: AddKeyRequest): Promise<AddResponse> {
    return this.apiService
      .request({
        endpoint: '/key',
        method: 'POST',
        data: request,
        version: '2.0'
      })
      .then((res) => ({
        id: String(res.id)
      }))
  }

  /**
   * Update key entry [Admin]
   * @param request must implement UpdateKeyRequest
   * @returns Promise<any>
   */
  public update(request: UpdateKeyRequest): Promise<any> {
    return this.apiService.request({
      endpoint: '/key',
      method: 'PATCH',
      data: request,
      version: '2.0'
    })
  }

  /**
   * Fetch all organization keys [Client, Provider]
   * @param request FetchAllOrganizationKeyRequest
   * @returns Promise<FetchAllOrganizationKeyResponse>
   */
  public fetchAllOrganizationKeys(
    request: FetchAllOrganizationKeyRequest
  ): Promise<Array<FetchAllOrganizationKeyResponse>> {
    return this.apiService.request({
      endpoint: '/key/organization',
      method: 'GET',
      data: request,
      version: '2.0'
    })
  }

  /**
   * Fetch single key organizations [Client, Provider]
   * @param id keyOrganization id
   * @returns Promise<FetchSingleOrganizationKeyResponse>
   */
  public fetchSingleOrganizationKey(
    id: string
  ): Promise<FetchSingleOrganizationKeyResponse> {
    return this.apiService.request({
      endpoint: `/key/organization/${id}`,
      method: 'GET',
      version: '2.0'
    })
  }

  /**
   * Add key organization [Provider]
   * @param request must implement AddOrganizationKeyRequest
   * @returns Promise<AddResponse>
   */
  public addOrganizationKey(
    request: AddOrganizationKeyRequest
  ): Promise<AddResponse> {
    return this.apiService
      .request({
        endpoint: '/key/organization',
        method: 'POST',
        data: request,
        version: '2.0'
      })
      .then((res) => ({
        id: String(res.keyOrganizationId)
      }))
  }

  /**
   * Update a key organization [Provider]
   * @param request must implement UpdateOrganizationKeyRequest
   * @returns Promise<boolean>
   */
  public updateOrganizationKey(
    request: UpdateOrganizationKeyRequest
  ): Promise<boolean> {
    return this.apiService.request({
      endpoint: `/key/organization/${request.id}`,
      method: 'PATCH',
      data: request,
      version: '2.0'
    })
  }

  /**
   * Delete key organization [Provider]
   * @param id organization key
   * @returns Promise<boolean>
   */
  public deleteOrganizationKey(id: string): Promise<boolean> {
    return this.apiService.request({
      endpoint: `/key/organization/${id}`,
      method: 'DELETE',
      version: '2.0'
    })
  }

  /**
   * Fetch all key accounts [Client, Provider]
   * @param request FetchAllAccountKeyRequest
   * @returns Promise<Array<AccountKeyEntryEntity>>
   */
  public fetchAllAccountKeys(
    request: FetchAllAccountKeyRequest
  ): Promise<Array<AccountKeyEntryEntity>> {
    return this.apiService.request({
      endpoint: '/key/account',
      method: 'GET',
      data: request,
      version: '2.0'
    })
  }

  /**
   * Fetch single key account [Client, Provider]
   * @param id keyAccount id
   * @returns Promise<FetchSingleAccountKeyResponse>
   */
  public fetchSingleAccountKey(
    id: string
  ): Promise<FetchSingleAccountKeyResponse> {
    return this.apiService.request({
      endpoint: `/key/account/${id}`,
      method: 'GET',
      version: '2.0'
    })
  }

  /**
   * Add key organization [Client, Provider]
   * @param request must implement AddAccountKeyRequest
   * @returns Promise<AddResponse>
   */
  public addAccountKey(request: AddAccountKeyRequest): Promise<AddResponse> {
    return this.apiService
      .request({
        endpoint: '/key/account',
        method: 'POST',
        data: request,
        version: '2.0'
      })
      .then((res) => ({
        id: String(res.keyOrganizationAccountId)
      }))
  }

  /**
   * Update a key organization [Client, Provider]
   * @param request must implement UpdateAccountKeyRequest
   * @returns Promise<boolean>
   */
  public updateAccountKey(request: UpdateAccountKeyRequest): Promise<boolean> {
    return this.apiService.request({
      endpoint: `/key/account/${request.id}`,
      method: 'PATCH',
      data: request,
      version: '2.0'
    })
  }

  /**
   * Delete key account [Client, Provider]
   * @param id key account
   * @returns Promise<boolean>
   */
  public deleteAccountKey(id: string): Promise<boolean> {
    return this.apiService.request({
      endpoint: `/key/account/${id}`,
      method: 'DELETE',
      version: '2.0'
    })
  }

  /**
   * Fetch all consumed keys [Client, Provider]
   * @param request FetchAllConsumedKeyRequest
   * @returns Promise<FetchAllConsumedKeyResponse>
   */
  public fetchAllConsumed(
    request: FetchAllConsumedKeyRequest
  ): Promise<FetchAllConsumedKeyResponse> {
    return this.apiService.request({
      endpoint: '/key/consumed',
      method: 'GET',
      data: request,
      version: '2.0'
    })
  }

  /**
   * Fetch single consumed key [Client, Provider]
   * @param id Consumed key id
   * @returns Promise<ConsumedKeyResponse>
   */
  public fetchSingleConsumed(id: string): Promise<ConsumedKeyResponse> {
    return this.apiService.request({
      endpoint: `/key/consumed/${id}`,
      method: 'GET',
      version: '2.0'
    })
  }

  /**
   * Add consumed key [Client]
   * @param request must implement AddConsumedKeyRequest
   * @returns Promise<AddResponse>
   */
  public addConsumed(request: AddConsumedKeyRequest): Promise<AddResponse> {
    return this.apiService
      .request({
        endpoint: '/key/consumed',
        method: 'POST',
        data: request,
        version: '2.0'
      })
      .then((res) => ({
        id: res.consumedId.toString()
      }))
  }

  /**
   * Update a consumed key [Client]
   * @param request must implement UpdateConsumedKeyRequest
   * @returns Promise<boolean>
   */
  public updateConsumed(request: UpdateConsumedKeyRequest): Promise<boolean> {
    return this.apiService.request({
      endpoint: `/key/consumed/${request.id}`,
      method: 'PATCH',
      data: request,
      version: '2.0'
    })
  }

  /**
   * Delete consumed [Client]
   * @param id Consumed meal's key
   * @returns Promise<boolean>
   */
  public deleteConsumed(id: string): Promise<boolean> {
    return this.apiService.request({
      endpoint: `/key/consumed/${id}`,
      method: 'DELETE',
      version: '2.0'
    })
  }
}

export { FoodKey }
