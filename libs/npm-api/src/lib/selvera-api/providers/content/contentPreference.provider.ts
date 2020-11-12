import { ApiService } from '../../services'
import { ContentPreferenceSingle } from './entities'
import {
  DeleteContentPreferenceRequest,
  GetContentPreferenceRequest,
  UpsertContentPreferenceRequest
} from './requests'

export class ContentPreference {
  public constructor(private readonly apiService: ApiService) {}

  /**
   * Delete Content Preference entry
   * @param request must implement DeleteContentPreferenceRequest
   * @returns Promise<void>
   */
  public deleteContentPreference(
    request: DeleteContentPreferenceRequest
  ): Promise<void> {
    return this.apiService.request({
      data: request,
      endpoint: `/content/preference/${request.organization}`,
      method: 'DELETE',
      version: '1.0'
    })
  }

  /**
   * Removes a preference entry for an organization
   * @param request must implement DeleteContentPreferenceRequest
   * @returns Promise<void>
   */
  public deleteContentVaultPreference(
    request: DeleteContentPreferenceRequest
  ): Promise<void> {
    return this.apiService.request({
      data: request,
      endpoint: `/content/vault/preference/${request.organization}`,
      method: 'DELETE',
      version: '1.0'
    })
  }

  /**
   * Get the most appropriate preference for the Organization context
   * @param request must implement GetContentPreferenceRequest
   * @returns Promise<ContentPreferenceSingle>
   */
  public getContentPreference(
    request: GetContentPreferenceRequest
  ): Promise<ContentPreferenceSingle> {
    return this.apiService.request({
      data: request,
      endpoint: '/content/preference',
      method: 'GET',
      version: '1.0'
    })
  }

  /**
   *  Get the most appropriate preference for the Organization context
   * @param request must implemente GetContentPreferenceRequest
   * @returns Promise<ContentPreferenceSingle>
   */
  public getContentVaultPreference(
    request: GetContentPreferenceRequest
  ): Promise<ContentPreferenceSingle> {
    return this.apiService.request({
      data: request,
      endpoint: '/content/vault/preference',
      method: 'GET',
      version: '1.0'
    })
  }

  /**
   * Upsert a Content preference entry for an Organization
   * @param request must implement UpsertContentPreferenceRequest
   * @returns Promise<void>
   */
  public upsertContentPreference(
    request: UpsertContentPreferenceRequest
  ): Promise<void> {
    return this.apiService.request({
      data: request,
      endpoint: `/content/preference/${request.organization}`,
      method: 'PUT',
      version: '1.0'
    })
  }

  /**
   * Upsert a Vault Content preference entry for an Organization
   * @param request must implemente UpsertContentPreferenceRequest
   * @returns Promise<void>
   */
  public upsertContentVaultPreference(
    request: UpsertContentPreferenceRequest
  ): Promise<void> {
    return this.apiService.request({
      data: request,
      endpoint: `/content/vault/preference/${request.organization}`,
      method: 'PUT',
      version: '1.0'
    })
  }
}
