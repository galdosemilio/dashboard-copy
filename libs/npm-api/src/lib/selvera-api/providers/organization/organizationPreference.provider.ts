import { Injectable } from '@angular/core'
import { ApiService } from '../../services/api.service'

import {
  CreateAdminPreferenceRequest,
  CreateAssetsOrganizationPreferenceRequest,
  CreateOrganizationPreferenceRequest,
  GetAssetsOrganizationPreferenceRequest,
  GetSingleOrganizationPreferenceRequest,
  UpdateAdminPreferenceRequest,
  UpdateOrganizationPreferenceRequest
} from './requests'
import {
  CreateAssetsOrganizationPreferenceResponse,
  GetAssetsOrganizationPreferenceResponse,
  OrganizationPreferenceSingle
} from './responses'

export class OrganizationPreference {
  public constructor(private readonly apiService: ApiService) {}

  /**
   * Generate asset upload URLs.
   * Permissions: Admin, Provider, OrgAdmin
   *
   * @param request must implement CreateAssetsOrganizationPreferenceRequest
   * @return Promise<CreateAssetsOrganizationPreferenceResponse>
   */
  public createAssets(
    request: CreateAssetsOrganizationPreferenceRequest
  ): Promise<CreateAssetsOrganizationPreferenceResponse> {
    return this.apiService.request({
      endpoint: `/organization/${request.id}/preference/asset`,
      method: 'POST',
      version: '2.0',
      data: request
    })
  }

  /**
   * Get organization preferences.
   *
   * @param request must implement GetSingleOrganizationPreferenceRequest
   * @return Promise<OrganizationPreferenceSingle>
   */
  public getSingle(
    request: GetSingleOrganizationPreferenceRequest
  ): Promise<OrganizationPreferenceSingle> {
    return this.apiService.request({
      endpoint: `/organization/${request.id}/preference`,
      method: 'GET',
      version: '4.0',
      data: request
    })
  }

  /**
   * Get organization assets.
   * Permissions: Public
   *
   * @param request must implement GetAssetsOrganizationPreferenceRequest
   * @return Promise<GetAssetsOrganizationPreferenceResponse>
   */
  public getAssets(
    request: GetAssetsOrganizationPreferenceRequest
  ): Promise<GetAssetsOrganizationPreferenceResponse> {
    return this.apiService.request({
      endpoint: `/organization/${request.id}/preference/assets`,
      method: 'GET',
      version: '4.0',
      data: request
    })
  }

  /**
   * Create organization preferences.
   * Permissions: Admin, Provider, OrgAdmin
   *
   * @param request must implement CreateOrganizationPreferenceRequest
   * @return Promise<void>
   */
  public create(request: CreateOrganizationPreferenceRequest): Promise<void> {
    return this.apiService.request({
      endpoint: `/organization/${request.id}/preference`,
      method: 'POST',
      version: '4.0',
      data: request
    })
  }

  /**
   * Update organization preferences.
   * Permissions: Admin, Provider, OrgAdmin
   *
   * @param request must implement UpdateOrganizationPreferenceRequest
   * @return Promise<void>
   */
  public update(request: UpdateOrganizationPreferenceRequest): Promise<void> {
    return this.apiService.request({
      endpoint: `/organization/${request.id}/preference`,
      method: 'PATCH',
      version: '4.0',
      data: request
    })
  }

  public createAdminPreference(
    preference: CreateAdminPreferenceRequest
  ): Promise<boolean> {
    return this.apiService.request({
      endpoint: `/organization/${preference.id}/preference/admin`,
      method: 'POST',
      version: '4.0',
      data: preference
    })
  }

  public updateAdminPreference(
    preference: UpdateAdminPreferenceRequest
  ): Promise<boolean> {
    return this.apiService.request({
      endpoint: `/organization/${preference.id}/preference/admin`,
      method: 'PATCH',
      version: '4.0',
      data: preference
    })
  }
}
