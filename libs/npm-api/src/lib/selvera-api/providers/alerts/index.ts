import {
  CreateAlertPreferencePackageRequest,
  CreateOrgAlertPreferenceRequest,
  FetchAlertPreferencePackageRequest,
  FetchAlertPreferenceRequest,
  FetchAlertTypesRequest,
  NotificationRequest,
  NotificationToggleRequest,
  ToggleGroupAlertsRequest,
  UpdateAccAlertPreferenceRequest,
  UpdateOrgAlertPreferenceRequest
} from '../../providers/alerts/requests'
import {
  AlertNotificationResponse,
  AlertPreferenceResponse,
  AlertTypesResponse,
  FetchAlertPreferencePackageResponse
} from '../../providers/alerts/responses'
import { ApiService } from '../../services/api.service'
import { Entity } from '../common/entities'

/**
 * Alerts Service.
 */
class Alerts {
  /**
   * Init Api Service
   */
  public constructor(private readonly apiService: ApiService) {}

  /**
   * Fetches notifications based on specific filters
   * @param data must implement NotificationRequest
   * @returns Promise<AlertNotificationResponse>
   */
  public fetchNotifications(
    data: NotificationRequest
  ): Promise<AlertNotificationResponse> {
    return this.apiService.request({
      endpoint: '/notification',
      method: 'GET',
      data: data
    })
  }

  /**
   * Toggles viewed status (seen/unseen) for a notification and an account
   * @param data must implement NotificationToggleRequest
   * @returns Promise<boolean>
   */
  public toggleNotification(data: NotificationToggleRequest): Promise<boolean> {
    return this.apiService.request({
      endpoint: `/notification/viewed/${data.notificationId}/${data.account}`,
      method: 'PATCH',
      data: data
    })
  }

  /**
   * Toggles viewed status (seen/unseen) for a notification group.
   * Permissions: Provider
   *
   * @param request must implement ToggleGroupAlertsRequest
   * @return Promise<void>
   */
  public toggleGroup(request: ToggleGroupAlertsRequest): Promise<void> {
    return this.apiService.request({
      endpoint: `/notification/viewed/group/${request.groupId}`,
      method: 'PATCH',
      data: request
    })
  }

  /**
   * Retrieves available alert types as a paged collection
   * @param data must implement FetchAlertTypesRequest
   * @returns Promise<AlertTypesResponse>
   */
  public fetchAlertTypes(
    data: FetchAlertTypesRequest
  ): Promise<AlertTypesResponse> {
    return this.apiService.request({
      endpoint: `/warehouse/alert/type`,
      method: 'GET',
      data: data,
      version: '2.0'
    })
  }

  /**
   * Retrieves available alert preferences as a paged collection
   * @param data must implement FetchAlertPreferenceRequest
   * @returns Promise<AlertPreferenceResponse>
   */
  public fetchAlertPreference(
    data: FetchAlertPreferenceRequest
  ): Promise<AlertPreferenceResponse> {
    return this.apiService.request({
      endpoint: `/warehouse/alert/preference`,
      method: 'GET',
      data: data,
      version: '2.0'
    })
  }

  /**
   * Creates alert preference for an organization and specified alert type
   * @param data must implement CreateOrgAlertPreferenceRequest
   * @returns Promise<string>
   */
  public createOrgAlertPreference(
    data: CreateOrgAlertPreferenceRequest
  ): Promise<string> {
    return this.apiService
      .request({
        endpoint: `/warehouse/alert/preference`,
        method: 'POST',
        data: data,
        version: '2.0'
      })
      .then((response) => response.id)
  }

  /**
   * Updates alert preference for an organization and specified alert type
   * @param data must implement UpdateOrgAlertPreferenceRequest
   * @returns Promise<boolean>
   */
  public updateOrgAlertPreference(
    data: UpdateOrgAlertPreferenceRequest
  ): Promise<boolean> {
    return this.apiService.request({
      endpoint: `/warehouse/alert/preference/${data.id}`,
      method: 'PATCH',
      data: data,
      version: '2.0'
    })
  }

  /**
   * Deletes alert preference for an organization and specified alert type
   * @param id Org preference ID
   * @returns Promise<void>
   */
  public deleteOrgAlertPreference(id: string | number): Promise<void> {
    return this.apiService.request({
      endpoint: `/warehouse/alert/preference/${id}`,
      method: 'DELETE',
      version: '2.0'
    })
  }

  /**
   * Creates or updates an account-level preference override for an account for an existing preference
   * @param data must implement AccAlertPreferenceRequest
   * @returns Promise<void>
   */
  public updateAccAlertPreference(
    data: UpdateAccAlertPreferenceRequest
  ): Promise<void> {
    return this.apiService.request({
      endpoint: `/warehouse/alert/preference/${data.id}/account`,
      method: 'PUT',
      data: data,
      version: '2.0'
    })
  }

  /**
   * Deletes an account-level preference override for an account for an existing preference
   * @param id Account preference ID
   * @param account Account ID
   * @returns Promise<void>
   */
  public deleteAccAlertPreference(
    id: string | number,
    account: string
  ): Promise<void> {
    return this.apiService.request({
      endpoint: `/warehouse/alert/preference/${id}/account/${account}`,
      method: 'DELETE',
      version: '2.0'
    })
  }

  /**
   * Create organization-level alert preference package association
   * @param request must implement CreateAlertPreferencePackageRequest
   * @returns Promise<Entity>
   */
  public createAlertPreferencePackage(
    request: CreateAlertPreferencePackageRequest
  ): Promise<Entity> {
    return this.apiService.request({
      data: request,
      endpoint: `/warehouse/alert/preference/package`,
      method: 'POST',
      version: '2.0'
    })
  }

  /**
   * Delete organization-level alert preference package association
   * @param id
   * @returns Promise<void>
   */
  public deleteAlertPreferencePackage(id: string): Promise<void> {
    return this.apiService.request({
      endpoint: `/warehouse/alert/preference/package/${id}`,
      method: 'DELETE',
      version: '2.0'
    })
  }

  /**
   * Get organization-level alert preference package associations
   * @param request must implement FetchAlertPreferencePackageRequest
   * @returns Promise<FetchAlertPreferencePackageResponse>
   */
  public fetchAlertPreferencePackage(
    request: FetchAlertPreferencePackageRequest
  ): Promise<FetchAlertPreferencePackageResponse> {
    return this.apiService.request({
      data: request,
      endpoint: `/warehouse/alert/preference/package`,
      method: 'GET',
      version: '2.0'
    })
  }
}

export { Alerts }
