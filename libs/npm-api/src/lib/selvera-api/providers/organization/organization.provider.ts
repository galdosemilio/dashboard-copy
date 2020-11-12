import { ApiService } from '../../services'
import { PagedResponse } from '../content/entities'
import { EmailTemplate, FoodTrackingPreference } from './entities'
import {
  CreateAssetsOrganizationPreferenceRequest,
  CreateEmailTemplateRequest,
  GetAllEmailTemplatesRequest,
  GetAllOrganizationRequest,
  OrgAccessRequest,
  OrgCreateAdminPreferenceRequest,
  OrgCreatePreferenceRequest,
  OrgCreateRequest,
  OrgDeleteFoodPreferenceRequest,
  OrgDescendantsRequest,
  OrgListRequest,
  OrgUpdateAdminPreferenceRequest,
  OrgUpdatePreferenceRequest,
  OrgUpdateRequest,
  OrgUpdateSchedulePreferencesRequest,
  UpdateEmailTemplateRequest
} from './requests'
import {
  CreateAssetsOrganizationPreferenceResponse,
  GetAllOrganizationResponse,
  OrgAccessResponse,
  OrgAssetsResponse,
  OrgCreateResponse,
  OrgDeleteResponse,
  OrgDescendantsResponse,
  OrgListResponse,
  OrgPreferencesResponse,
  OrgSchedulePreferencesResponse,
  OrgSingleResponse
} from './responses'

/**
 * Organization Service.
 */
class Organization {
  /**
   * Init Api Service
   */
  public constructor(private readonly apiService: ApiService) {}

  /**
   * Retrieve a list of organizations.
   * Permissions: Admin
   *
   * @param [request] must implement GetAllOrganizationRequest
   * @return Promise<GetAllOrganizationResponse>
   */
  public getAll(
    request?: GetAllOrganizationRequest
  ): Promise<GetAllOrganizationResponse> {
    return this.apiService.request({
      endpoint: `/organization/`,
      method: 'GET',
      version: '2.0',
      data: request
    })
  }

  /**
   * Create new organization entry
   * @param orgCreateRequest must implement OrgCreateRequest
   * @returns Promise<OrgCreateResponse>
   */
  public create(
    orgCreateRequest: OrgCreateRequest
  ): Promise<OrgCreateResponse> {
    return this.apiService.request({
      endpoint: `/organization`,
      method: 'POST',
      data: orgCreateRequest,
      version: '2.0'
    })
  }

  /**
   * Update organization entry
   * @param orgUpdateRequest must implement OrgUpdateRequest
   * @returns Promise<void>
   */
  public update(orgUpdateRequest: OrgUpdateRequest): Promise<void> {
    return this.apiService.request({
      endpoint: `/organization/${orgUpdateRequest.id}`,
      method: 'PUT',
      data: orgUpdateRequest,
      version: '2.0'
    })
  }

  /**
   * Deactivates (deletes) an existing organization
   * @param organizationId Organization ID
   * @returns Promise<OrgDeleteResponse>
   */
  public delete(organizationId: string | number): Promise<OrgDeleteResponse> {
    return this.apiService.request({
      endpoint: `/organization/${organizationId}`,
      method: 'DELETE',
      version: '2.0'
    })
  }

  /**
   * Retrieve all descendants of an organization
   * @param orgDescendantsRequest must implement OrgDescendantsRequest
   * @returns Promise<OrgDescendantsResponse>
   */
  public getDescendants(
    orgDescendantsRequest: OrgDescendantsRequest
  ): Promise<OrgDescendantsResponse> {
    return this.apiService.request({
      endpoint: `/organization/${orgDescendantsRequest.organization}/descendants`,
      method: 'GET',
      data: orgDescendantsRequest,
      version: '2.0'
    })
  }

  /**
   * Get a listing of accessible organizations for an account
   * @param organizationAccessRequest must implement OrgAccessRequest
   * @returns Promise<OrgAccessResponse>
   */
  public getAccessibleList(
    organizationAccessRequest: OrgAccessRequest
  ): Promise<OrgAccessResponse> {
    return this.apiService.request({
      endpoint: '/access/organization',
      method: 'GET',
      data: organizationAccessRequest,
      version: '2.0'
    })
  }

  /**
   * Get a listing of organizations for an admin
   * @param organizationGetRequest must implement OrgListRequest
   * @returns Promise<OrgListResponse>
   */
  public getList(
    organizationGetRequest: OrgListRequest
  ): Promise<OrgListResponse> {
    return this.apiService.request({
      endpoint: '/organization',
      method: 'GET',
      data: organizationGetRequest,
      version: '2.0'
    })
  }

  /**
   * Get a single organization
   * @param organizationId of organization to fetch
   * @returns Promise<OrgSingleResponse>
   */
  public getSingle(
    organizationId: string | number
  ): Promise<OrgSingleResponse> {
    return this.apiService.request({
      endpoint: `/organization/${organizationId}`,
      method: 'GET',
      version: '2.0'
    })
  }

  /**
   * Get organization preferences
   * @param organizationId of organization to fetch
   * @param mala Indicates whether to include MALA settings in the response
   * @returns Promise<OrgPreferencesResponse>
   */
  public getPreferences(
    organizationId: string | number,
    mala?: boolean
  ): Promise<OrgPreferencesResponse> {
    return this.apiService.request({
      endpoint: `/organization/${organizationId}/preference`,
      method: 'GET',
      version: '4.0',
      data: { mala }
    })
  }

  /**
   * Create preference for an organization
   * @param preference must implement OrgCreatePreferenceRequest
   * @returns Promise<boolean>
   */
  public createPreference(
    preference: OrgCreatePreferenceRequest
  ): Promise<boolean> {
    return this.apiService.request({
      endpoint: `/organization/${preference.id}/preference`,
      method: 'POST',
      version: '4.0',
      data: preference
    })
  }

  /**
   * Update organization preferences
   * @param preference must implement OrgUpdatePreferenceRequest
   * @returns Promise<boolean>
   */
  public updatePreferences(
    preference: OrgUpdatePreferenceRequest
  ): Promise<void> {
    return this.apiService.request({
      endpoint: `/organization/${preference.id}/preference`,
      method: 'PATCH',
      version: '4.0',
      data: preference
    })
  }

  /**
   * Get organization assets
   * @param organizationId of organization to fetch
   * @param mala Indicates whether to include MALA settings in the response
   * @returns Promise<OrgAssetsResponse>
   */
  public getAssets(
    organizationId: string | number,
    mala?: boolean
  ): Promise<OrgAssetsResponse> {
    return this.apiService.request({
      endpoint: `/organization/${organizationId}/preference/assets`,
      method: 'GET',
      version: '4.0',
      data: { mala }
    })
  }

  /**
   * Get food tracking preferences for an organization
   * @param organizationId of organization to fetch
   * @returns Promise<Array<FoodTrackingPreference>>
   */
  public getFoodPreferences(
    organizationId: string | number
  ): Promise<Array<FoodTrackingPreference>> {
    return this.apiService.request({
      endpoint: `/food/preference`,
      method: 'GET',
      data: {
        organization: organizationId
      }
    })
  }

  /**
   * Add food tracking preference for an organization
   * @param preference must implement FoodTrackingPreference
   * @returns Promise<boolean>
   */
  public addFoodPreference(
    preference: FoodTrackingPreference
  ): Promise<boolean> {
    return this.apiService.request({
      endpoint: `/food/preference`,
      method: 'POST',
      data: preference
    })
  }

  /**
   * Update food tracking preference for an organization
   * @param preference must implement FoodTrackingPreference
   * @returns Promise<boolean>
   */
  public updateFoodPreference(
    preference: FoodTrackingPreference
  ): Promise<boolean> {
    return this.apiService.request({
      endpoint: `/food/preference`,
      method: 'PATCH',
      data: preference
    })
  }

  /**
   * Delete food tracking preference for an organization
   * @param request must implement OrgDeleteFoodPreferenceRequest
   * @returns Promise<boolean>
   */
  public deleteFoodPreference(
    request: OrgDeleteFoodPreferenceRequest
  ): Promise<boolean> {
    return this.apiService.request({
      endpoint: `/food/preference`,
      method: 'DELETE',
      params: request
    })
  }

  /**
   * Get schedule preferences for an organization
   * @param organizationId Organization ID
   * @returns Promise<OrgSchedulePreferencesResponse>
   */
  public getSchedulePreferences(
    organizationId: string
  ): Promise<OrgSchedulePreferencesResponse> {
    const empty: OrgSchedulePreferencesResponse = {
      id: '',
      disabledFor: []
    }
    return (
      this.apiService
        .request({
          endpoint: `/schedule/preferences/${organizationId}`,
          method: 'GET',
          version: '3.0'
        })
        .then((res) => Object.assign(empty, res))
        // return empty preferences if it's not found
        .catch((err) =>
          err === 'Endpoint not found'
            ? Promise.resolve(empty)
            : Promise.reject(err)
        )
    )
  }

  /**
   * Set preference entry for an organization. Accessible only for admins
   * @param putRequest must implement OrgUpdateSchedulePreferencesRequest
   * @returns Promise<void>
   */
  public updateSchedulePreferences(
    putRequest: OrgUpdateSchedulePreferencesRequest
  ): Promise<void> {
    return this.apiService.request({
      endpoint: `/schedule/preferences/${putRequest.organization}`,
      method: 'PUT',
      data: putRequest,
      version: '3.0'
    })
  }

  /**
   * Delete schedule preferences of an organization
   * @param organizationId Organization ID
   * @returns Promise<boolean>
   */
  public deleteSchedulePreferences(organizationId: string): Promise<boolean> {
    return this.apiService.request({
      endpoint: `/schedule/preferences/${organizationId}`,
      method: 'DELETE',
      version: '3.0'
    })
  }

  /**
   * Create admin organization preferences
   * @param preference must implement OrgCreateAdminPreferenceRequest
   * @returns Promise<boolean>
   */
  public createAdminPreference(
    preference: OrgCreateAdminPreferenceRequest
  ): Promise<boolean> {
    return this.apiService.request({
      endpoint: `/organization/${preference.id}/preference/admin`,
      method: 'POST',
      version: '4.0',
      data: preference
    })
  }

  /**
   * Update admin organization preferences
   * @param preference must implement OrgUpdateAdminPreferenceRequest
   * @returns Promise<boolean>
   */
  public updateAdminPreference(
    preference: OrgUpdateAdminPreferenceRequest
  ): Promise<boolean> {
    return this.apiService.request({
      endpoint: `/organization/${preference.id}/preference/admin`,
      method: 'PATCH',
      version: '4.0',
      data: preference
    })
  }

  /**
   * Generate asset upload URLs
   * @param preference must implement CreateAssetsOrganizationPreferenceRequest
   * @returns Promise<CreateAssetsOrganizationPreferenceResponse>
   */
  public CreateAssets(
    preference: CreateAssetsOrganizationPreferenceRequest
  ): Promise<CreateAssetsOrganizationPreferenceResponse> {
    return this.apiService.request({
      endpoint: `/organization/${preference.id}/preference/asset`,
      method: 'POST',
      version: '2.0',
      data: preference
    })
  }

  /**
   * Creates a new email template
   * @param request must implement CreateEmailTemplateRequest
   * @returns Promise<void>
   */
  public createEmailTemplate(
    request: CreateEmailTemplateRequest
  ): Promise<void> {
    return this.apiService.request({
      data: request,
      endpoint: '/organization/preference/email',
      method: 'POST',
      version: '2.0'
    })
  }

  /**
   * Deletes an email template
   * @param id
   * @returns Promise<void>
   */
  public deleteEmailTemplate(id: string): Promise<void> {
    return this.apiService.request({
      data: { id },
      endpoint: `/organization/preference/email/${id}`,
      method: 'DELETE',
      version: '2.0'
    })
  }

  /**
   * Retrieves a single email template
   * @param id
   * @returns Promise<EmailTemplate>
   */
  public getSingleEmailTemplate(id: string): Promise<EmailTemplate> {
    return this.apiService.request({
      data: { id },
      endpoint: `/organization/preference/email/${id}`,
      method: 'GET',
      version: '2.0'
    })
  }

  /**
   * Retrieves a list of email templates for an organization
   * @param request must implement GetAllEmailTemplatesRequest
   * @returns Promise<PagedResponse<EmailTemplate>>
   */
  public getAllEmailTemplates(
    request: GetAllEmailTemplatesRequest
  ): Promise<PagedResponse<EmailTemplate>> {
    return this.apiService.request({
      data: request,
      endpoint: '/organization/preference/email',
      method: 'GET',
      version: '2.0'
    })
  }

  /**
   * Updates an email template
   * @param request must implement UpdateEmailTemplateRequest
   * @returns Promise<void>
   */
  public updateEmailTemplate(
    request: UpdateEmailTemplateRequest
  ): Promise<void> {
    return this.apiService.request({
      data: request,
      endpoint: `/organization/preference/email/${request.id}`,
      method: 'PATCH',
      version: '2.0'
    })
  }
}

export { Organization }
