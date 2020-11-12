import { ApiService } from '../../services'
import { Entity } from '../common/entities'
import { CommunicationPreferenceSingle } from './entities'
import {
  CreateCommunicationPreferenceRequest,
  GetSingleCommunicationPreferenceRequest
} from './requests'
import { UpdateCommunicationPreferenceRequest } from './requests/updateCommunicationPreference.request'
export class CommunicationPreference {
  public constructor(private readonly apiService: ApiService) {}

  /**
   * Create a Preference entry for an Organization
   * @param request must implement CreateCommunicationPreferenceRequest
   * @returns Promise<Entity>
   */
  public createPreference(
    request: CreateCommunicationPreferenceRequest
  ): Promise<Entity> {
    return this.apiService.request({
      data: request,
      endpoint: '/communication/preference',
      method: 'POST',
      version: '1.0'
    })
  }

  /**
   * Remove a Preference entry
   * @param request must implement Entity
   * @returns Promise<void>
   */
  public deletePreference(request: Entity): Promise<void> {
    return this.apiService.request({
      data: request,
      endpoint: `/communication/preference/${request.id}`,
      method: 'DELETE',
      version: '1.0'
    })
  }

  /**
   * Get a single Preference entry
   * @param request must implement Entity
   * @returns Promise<CommunicationPreferenceSingle>
   */
  public getPreference(
    request: Entity
  ): Promise<CommunicationPreferenceSingle> {
    return this.apiService.request({
      data: request,
      endpoint: `/communication/preference/${request.id}`,
      method: 'GET',
      version: '1.0'
    })
  }

  /**
   * Get a single Preference entry for an Organization
   * @param request must implement GetSingleCommunicationPreferenceRequest
   * @returns Promise<CommunicationPreferenceSingle>
   */
  public getPreferenceByOrg(
    request: GetSingleCommunicationPreferenceRequest
  ): Promise<CommunicationPreferenceSingle> {
    return this.apiService.request({
      data: request,
      endpoint: '/communication/preference',
      method: 'GET',
      version: '1.0'
    })
  }

  /**
   * Update a Preference entry
   * @param request must implement UpdateCommunicationPreferenceRequest
   * @returns Promise<void>
   */
  public updatePreference(
    request: UpdateCommunicationPreferenceRequest
  ): Promise<void> {
    return this.apiService.request({
      data: request,
      endpoint: `/communication/preference/${request.id}`,
      method: 'PATCH',
      version: '1.0'
    })
  }
}
