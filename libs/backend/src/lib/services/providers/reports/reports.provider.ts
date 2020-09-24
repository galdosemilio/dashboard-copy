import { Injectable } from '@angular/core';
import { ApiService } from '../../api.service';

import {
  GetActivityLevelReportsRequest,
  GetAgeDemographicsReportsRequest,
  GetBasicSleepReportsRequest,
  GetBodyCompositionReportsRequest,
  GetEnrollmentPatientCountReportsRequest,
  GetGenderDemographicsReportsRequest,
  GetLoginInactivityReportsRequest,
  GetOrganizationActivityReportsRequest,
  GetProviderCountReportsRequest,
  GetSignUpsListReportsRequest,
  GetSignUpsReportsRequest,
  GetSignUpsTimelineReportsRequest,
  GetUserActivityReportsRequest,
  GetWeightChangeReportsRequest
} from './requests';
import {
  GetActivityLevelReportsResponse,
  GetAgeDemographicsReportsResponse,
  GetBasicSleepReportsResponse,
  GetBodyCompositionReportsResponse,
  GetGenderDemographicsReportsResponse,
  GetLoginInactivityReportsResponse,
  GetOrganizationActivityReportsResponse,
  GetProviderCountReportsResponse,
  GetSignUpsListReportsResponse,
  GetSignUpsReportsResponse,
  GetSignUpsTimelineReportsResponse,
  GetUserActivityReportsResponse,
  GetWeightChangeReportsResponse
} from './responses';

@Injectable({
  providedIn: 'root'
})
export class Reports {
  public constructor(private readonly apiService: ApiService) {}

  /**
   * Fetch a report for inactive users in specific buckets (30 - 60 days, 60 - 90 days, 90+ days) based on last login date.
   * Permissions: OrgAccess
   *
   * @param request must implement GetLoginInactivityReportsRequest
   * @return Promise<GetLoginInactivityReportsResponse>
   */
  public getLoginInactivity(
    request: GetLoginInactivityReportsRequest
  ): Promise<GetLoginInactivityReportsResponse> {
    return this.apiService.request({
      endpoint: `/warehouse/login/inactivity`,
      method: 'GET',
      version: '2.0',
      data: request
    });
  }

  /**
   * Fetch a report for aggregate client age breakdown.
   * Permissions: Admin, Provider, OrgAccess
   *
   * @param request must implement GetAgeDemographicsReportsRequest
   * @return Promise<GetAgeDemographicsReportsResponse>
   */
  public getAgeDemographics(
    request: GetAgeDemographicsReportsRequest
  ): Promise<GetAgeDemographicsReportsResponse> {
    return this.apiService.request({
      endpoint: `/warehouse/demographics/age`,
      method: 'GET',
      version: '2.0',
      data: request
    });
  }

  /**
   * Fetch a report for aggregate client gender breakdown.
   * Permissions: Admin, Provider, OrgAccess
   *
   * @param request must implement GetGenderDemographicsReportsRequest
   * @return Promise<GetGenderDemographicsReportsResponse>
   */
  public getGenderDemographics(
    request: GetGenderDemographicsReportsRequest
  ): Promise<GetGenderDemographicsReportsResponse> {
    return this.apiService.request({
      endpoint: `/warehouse/demographics/gender`,
      method: 'GET',
      version: '2.0',
      data: request
    });
  }

  /**
   * New and total patients count report based on package enrollments for given time range.
   * Permissions: Admin, Provider, OrgAccess
   *
   * @param request must implement GetEnrollmentPatientCountReportsRequest
   * @return Promise<void>
   */
  public getEnrollmentPatientCount(
    request: GetEnrollmentPatientCountReportsRequest
  ): Promise<void> {
    return this.apiService.request({
      endpoint: `/warehouse/enrollment/patient-count`,
      method: 'GET',
      version: '2.0',
      data: request
    });
  }

  /**
   * Fetch a report for user weight changes for specific organization.
   * Permissions: Admin, Provider, OrgAccess, OrgClientPHI
   *
   * @param request must implement GetWeightChangeReportsRequest
   * @return Promise<GetWeightChangeReportsResponse>
   */
  public getWeightChange(
    request: GetWeightChangeReportsRequest
  ): Promise<GetWeightChangeReportsResponse> {
    return this.apiService.request({
      endpoint: `/warehouse/weight/change`,
      method: 'GET',
      version: '2.0',
      data: request
    });
  }

  /**
   * Returns JSON report with number of accounts assigned to given levels by average of steps per day.
   * Permissions: Admin, Provider, OrgAccess, OrgClientPHI
   *
   * @param request must implement GetActivityLevelReportsRequest
   * @return Promise<GetActivityLevelReportsResponse>
   */
  public getActivityLevel(
    request: GetActivityLevelReportsRequest
  ): Promise<GetActivityLevelReportsResponse> {
    return this.apiService.request({
      endpoint: `/warehouse/step/activity/level`,
      method: 'GET',
      version: '2.0',
      data: request
    });
  }

  /**
   * Returns JSON report with number of accounts with sleep data for given date range.
   * Permissions: Admin, Provider, OrgAccess, OrgClientPHI
   *
   * @param request must implement GetBasicSleepReportsRequest
   * @return Promise<GetBasicSleepReportsResponse>
   */
  public getBasicSleep(
    request: GetBasicSleepReportsRequest
  ): Promise<GetBasicSleepReportsResponse> {
    return this.apiService.request({
      endpoint: `/warehouse/sleep/basic`,
      method: 'GET',
      version: '2.0',
      data: request
    });
  }

  /**
   * Calculates an average change in specified metric as a cohort report for a specified hierarchy.
   * Permissions: Admin, Provider, OrgAccess, OrgClientPHI
   *
   * @param request must implement GetBodyCompositionReportsRequest
   * @return Promise<GetBodyCompositionReportsResponse>
   */
  public getBodyComposition(
    request: GetBodyCompositionReportsRequest
  ): Promise<GetBodyCompositionReportsResponse> {
    return this.apiService.request({
      endpoint: `/warehouse/measurement/body-composition`,
      method: 'GET',
      version: '2.0',
      data: request
    });
  }

  /**
   * Fetches activity over a timeline per organization.
   * Permissions: Admin, Provider, OrgAccess
   *
   * @param request must implement GetOrganizationActivityReportsRequest
   * @return Promise<GetOrganizationActivityReportsResponse>
   */
  public getOrganizationActivity(
    request: GetOrganizationActivityReportsRequest
  ): Promise<GetOrganizationActivityReportsResponse> {
    return this.apiService.request({
      endpoint: `/warehouse/organization/activity`,
      method: 'GET',
      version: '2.0',
      data: request
    });
  }

  /**
   * Returns JSON report with number of organization's active clients and providers.
   * Along within number of users who has any API activity with requested dates range.
   * Permissions: Admin, Provider, OrgAccess
   *
   * @param request must implement GetUserActivityReportsRequest
   * @return Promise<GetUserActivityReportsResponse>
   */
  public getUserActivity(
    request: GetUserActivityReportsRequest
  ): Promise<GetUserActivityReportsResponse> {
    return this.apiService.request({
      endpoint: `/warehouse/organization/activity/feature`,
      method: 'GET',
      version: '2.0',
      data: request
    });
  }

  /**
   * Fetches organization sign-ups over a timeline per organization.
   * Permissions: Admin, Provider, OrgAccess
   *
   * @param request must implement GetSignUpsTimelineReportsRequest
   * @return Promise<GetSignUpsTimelineReportsResponse>
   */
  public getSignUpsTimeline(
    request: GetSignUpsTimelineReportsRequest
  ): Promise<GetSignUpsTimelineReportsResponse> {
    return this.apiService.request({
      endpoint: `/warehouse/organization/sign-ups/timeline`,
      method: 'GET',
      version: '2.0',
      data: request
    });
  }

  /**
   * Fetches organization sign-ups over a list per organization.
   * Permissions: Admin, Provider, OrgAccess
   *
   * @param request must implement GetSignUpsListReportsRequest
   * @return Promise<GetSignUpsListReportsResponse>
   */
  public getSignUpsList(
    request: GetSignUpsListReportsRequest
  ): Promise<GetSignUpsListReportsResponse> {
    return this.apiService.request({
      endpoint: `/warehouse/organization/sign-ups/list`,
      method: 'GET',
      version: '2.0',
      data: request
    });
  }

  /**
   * Fetches new sign-ups report divided into organizations.
   * Permissions: Admin, Provider, OrgAccess
   *
   * @param request must implement GetSignUpsReportsRequest
   * @return Promise<GetSignUpsReportsResponse>
   */
  public getSignUps(request: GetSignUpsReportsRequest): Promise<GetSignUpsReportsResponse> {
    return this.apiService.request({
      endpoint: `/warehouse/organization/sign-ups`,
      method: 'GET',
      version: '2.0',
      data: request
    });
  }

  /**
   * Returns JSON report with number of organization's providers that are active between specific dates.
   * Permissions: Provider, Admin, OrgAccess
   *
   * @param request must implement GetProviderCountReportsRequest
   * @return Promise<GetProviderCountReportsResponse>
   */
  public getProviderCount(
    request: GetProviderCountReportsRequest
  ): Promise<GetProviderCountReportsResponse> {
    return this.apiService.request({
      endpoint: `/warehouse/provider/count`,
      method: 'GET',
      version: '2.0',
      data: request
    });
  }
}
