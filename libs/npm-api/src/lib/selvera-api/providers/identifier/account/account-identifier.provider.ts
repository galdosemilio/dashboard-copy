import { ApiService } from '../../../services/api.service'
import { Identifier } from './entities'
import {
  AddIdentifierRequest,
  DeleteIdentifierRequest,
  FetchAllIdentifiersRequest,
  FetchIdentifierRequest,
  FetchIdentifierWhitelistRequest,
  UpdateIdentifierRequest
} from './requests'
import {
  AddIdentifierResponse,
  FetchAllIdentifiersResponse,
  FetchIdentifierWhitelistResponse
} from './responses'

/**
 * Account Identifier posting/fetching/updating
 */
class AccountIdentifier {
  /**
   * Init Api Service
   */
  public constructor(private readonly apiService: ApiService) {}

  /**
   * Get listing of all identifiers for an account.
   * @param request must implement FetchAllIdentifiersRequest
   * @returns Promise<FetchAllIdentifiersResponse>
   */
  public fetchAll(
    request: FetchAllIdentifiersRequest
  ): Promise<FetchAllIdentifiersResponse> {
    return this.apiService.request({
      endpoint: `/account/${request.account}/external-identifier`,
      method: 'GET',
      version: '2.0',
      data: request
    })
  }

  public fetchIdentifierWhitelist(
    request: FetchIdentifierWhitelistRequest
  ): Promise<FetchIdentifierWhitelistResponse> {
    return this.apiService.request({
      endpoint: `/organization/${request.organization}/external-identifier/whitelist`,
      method: 'GET',
      version: '2.0',
      data: request
    })
  }

  /**
   * Get external identifier.
   * @param request must implement FetchIdentifierRequest
   * @returns Promise<Identifier>
   */
  public fetch(request: FetchIdentifierRequest): Promise<Identifier> {
    return this.apiService.request({
      endpoint: `/account/${request.account}/external-identifier/${request.id}`,
      method: 'GET',
      version: '2.0'
    })
  }

  /**
   * Create external identifier.
   * @param request must implement AddIdentifierRequest
   * @returns Promise<AddIdentifierResponse>
   */
  public add(request: AddIdentifierRequest): Promise<AddIdentifierResponse> {
    return this.apiService.request({
      endpoint: `/account/${request.account}/external-identifier`,
      method: 'POST',
      version: '2.0',
      data: request
    })
  }

  /**
   * Update external identifier entry.
   * @param request must implement UpdateIdentifierRequest
   * @returns Promise<void>
   */
  public update(request: UpdateIdentifierRequest): Promise<void> {
    return this.apiService.request({
      endpoint: `/account/${request.account}/external-identifier/${request.id}`,
      method: 'PATCH',
      version: '2.0',
      data: request
    })
  }

  /**
   * Delete external identifier entry.
   * @param request must implement DeleteIdentifierRequest
   * @returns Promise<void>
   */
  public delete(request: DeleteIdentifierRequest): Promise<void> {
    return this.apiService.request({
      endpoint: `/account/${request.account}/external-identifier/${request.id}`,
      method: 'DELETE',
      version: '2.0'
    })
  }
}

export { AccountIdentifier }
