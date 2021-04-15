import {
  ActivityLevelRequest,
  AgeDemographicsRequest,
  EnrollmentSimpleReportRequest,
  EnrollmentSnapshotRequest,
  EnrollmentTimelineRequest,
  FetchOrganizationBillingRequest,
  FetchPatientListingAssociationRequest,
  FetchPatientListingPackageEnrollmentsRequest,
  FetchPatientListingRequest,
  FetchRPMBillingSummaryRequest,
  GenderDemographicsRequest,
  OrganizationActivityRequest,
  PatientCountRequest,
  ProviderCountRequest,
  SignupsListRequest,
  SignupsSnapshotRequest,
  SignupsTimelineRequest,
  SleepReportRequest,
  WeightChangeRequest
} from '../../providers/reports/requests'
import {
  ActivityLevelSegment,
  AgeDemographicsSegment,
  EnrollmentSimpleReportResponse,
  EnrollmentSnapshotSegment,
  EnrollmentTimelineSegment,
  FetchOrganizationBillingResponse,
  GenderDemographicsSegment,
  OrganizationActivityAggregate,
  PatientCountSegment,
  ProviderCountSegment,
  RPMStateSummaryItem,
  SignupsListSegment,
  SignupsSnapshotSegment,
  SignupsTimelineSegment,
  SleepReportResponse,
  WeightChangeResponse
} from '../../providers/reports/responses'
import { ApiService } from '../../services/api.service'
import { PagedResponse } from '../content/entities'
import {
  CountedPaginatedResponse,
  PatientListingAssociationItem,
  PatientListingItem,
  PatientListingPackageEnrollmentItem
} from './entities'

/**
 * Reports Service.
 */
class Reports {
  /**
   * Init Api Service
   */
  public constructor(private readonly apiService: ApiService) {}

  /**
   * Fetch Enrollment Snapshot for an Organization.
   * @param enrollmentSnapshotRequest must implement EnrollmentSnapshotRequest
   * @returns Promise<Array<EnrollmentSnapshotSegment>>
   */
  public fetchEnrollmentSnapshot(
    enrollmentSnapshotRequest: EnrollmentSnapshotRequest
  ): Promise<Array<EnrollmentSnapshotSegment>> {
    return this.apiService
      .request({
        endpoint: '/warehouse/enrollment/accounts-by-organization',
        method: 'GET',
        data: enrollmentSnapshotRequest,
        version: '2.0'
      })
      .then((response) => response.data)
  }

  /**
   * Fetch Enrollment over a Timeline for an Organization.
   * @param enrollmentTimelineRequest must implement EnrollmentTimelineRequest
   * @returns Promise<Array<EnrollmentTimelineSegment>>
   */
  public fetchEnrollmentTimeline(
    enrollmentTimelineRequest: EnrollmentTimelineRequest
  ): Promise<Array<EnrollmentTimelineSegment>> {
    return this.apiService
      .request({
        endpoint: '/warehouse/enrollment/accounts-by-organization/timeline',
        method: 'GET',
        data: enrollmentTimelineRequest,
        version: '2.0'
      })
      .then((response) => response.data)
  }

  /**
   * Fetch Patient Listing (supports phase filters)
   * @param request must implement FetchPatientListingRequest
   * @returns Promise<CountedPaginatedResponse<PatientListingItem>>
   */
  public fetchPatientListing(
    request: FetchPatientListingRequest
  ): Promise<CountedPaginatedResponse<PatientListingItem>> {
    return this.apiService.request({
      data: request,
      endpoint: '/warehouse/patient-listing',
      method: 'GET',
      version: '1.0'
    })
  }

  /**
   * Fetches the full list of consolidated organization-patient associations that exist for an account
   * @param request must implement FetchPatientListingAssociationRequest
   * @return Promise<CountedPaginatedResponse<PatientListingAssociationItem>>
   */
  public fetchPatientListingAssociation(
    request: FetchPatientListingAssociationRequest
  ): Promise<CountedPaginatedResponse<PatientListingAssociationItem>> {
    return this.apiService.request({
      data: request,
      endpoint: '/warehouse/patient-listing/association',
      method: 'GET',
      version: '1.0'
    })
  }

  /**
   * Fetches Package enrollments for a patient
   * @param request must implement FetchPatientListingPackageEnrollmentsRequest
   * @returns Promise<CountedPaginatedResponse<PatientListingPackageEnrollmentItem>>
   */
  public fetchPatientListingPackageEnrollments(
    request: FetchPatientListingPackageEnrollmentsRequest
  ): Promise<CountedPaginatedResponse<PatientListingPackageEnrollmentItem>> {
    return this.apiService.request({
      data: request,
      endpoint: '/warehouse/patient-listing/enrollment',
      method: 'GET',
      version: '1.0'
    })
  }

  /**
   * Fetches new Sign-ups Snapshot divided into Organizations.
   * @param signupsSnapshotRequest must implement SignupsSnapshotRequest
   * @returns Promise<Array<SignupsSnapshotSegment>>
   */
  public fetchSignupsSnapshot(
    signupsSnapshotRequest: SignupsSnapshotRequest
  ): Promise<Array<SignupsSnapshotSegment>> {
    return this.apiService
      .request({
        endpoint: '/warehouse/organization/sign-ups',
        method: 'GET',
        data: signupsSnapshotRequest,
        version: '2.0'
      })
      .then((response) => response.data)
  }

  /**
   * Fetches Sign-ups over a Timeline for an Organization.
   * @param signupsTimelineRequest must implement SignupsTimelineRequest
   * @returns Promise<Array<EnrollmentTimelineSegment>>
   */
  public fetchSignupsTimeline(
    signupsTimelineRequest: SignupsTimelineRequest
  ): Promise<Array<SignupsTimelineSegment>> {
    return this.apiService
      .request({
        endpoint: '/warehouse/organization/sign-ups/timeline',
        method: 'GET',
        data: signupsTimelineRequest,
        version: '2.0'
      })
      .then((response) => response.data)
  }

  /**
   * Fetches activity over a timeline per organization
   * @param organizationActivityRequest must implement OrganizationActivityRequest
   * @returns Promise<Array<OrganizationActivityAggregate>>
   */
  public fetchOrganizationActivity(
    organizationActivityRequest: OrganizationActivityRequest
  ): Promise<Array<OrganizationActivityAggregate>> {
    return this.apiService
      .request({
        endpoint: '/warehouse/organization/activity',
        method: 'GET',
        data: organizationActivityRequest,
        version: '2.0'
      })
      .then((response) => response.data)
  }

  /**
   * Retrieves a listing of data required to calculate billing information
   * @param request must implement FetchOrganizationBillingRequest
   * @returns Promise<FetchOrganizationBillingResponse>
   */
  public fetchOrganizationBilling(
    request: FetchOrganizationBillingRequest
  ): Promise<FetchOrganizationBillingResponse> {
    return this.apiService.request({
      endpoint: '/warehouse/organization/billing',
      method: 'GET',
      data: request,
      version: '1.0'
    })
  }

  /**
   * Fetches organization sign-ups over a list per organization
   * @param fetchSignupsListRequest must implement FetchSignupsListRequest
   * @returns Promise<Array<SignupsListSegment>>
   */
  public fetchSignupsList(
    signupsListRequest: SignupsListRequest
  ): Promise<Array<SignupsListSegment>> {
    return this.apiService
      .request({
        endpoint: '/warehouse/organization/sign-ups/list',
        method: 'GET',
        data: signupsListRequest,
        version: '2.0'
      })
      .then((response) => response.data)
  }

  /**
   * Fetches accounts assigned to given levels by average of steps per day
   * @param activityLevelRequest must implement ActivityLevelRequest
   * @returns Promise<Array<ActivityLevelSegment>>
   */
  public fetchActivityLevel(
    activityLevelRequest: ActivityLevelRequest
  ): Promise<Array<ActivityLevelSegment>> {
    return this.apiService
      .request({
        endpoint: '/warehouse/step/activity/level',
        method: 'GET',
        data: activityLevelRequest,
        version: '2.0'
      })
      .then((response) => response.data)
  }

  /**
   * Fetch accounts with sleep data for given date range
   * @param sleepRequest must implement SleepReportRequest
   * @returns Promise<SleepReportResponse>
   */
  public fetchSleep(
    sleepRequest: SleepReportRequest
  ): Promise<SleepReportResponse> {
    return this.apiService.request({
      endpoint: '/warehouse/sleep/basic',
      method: 'GET',
      data: sleepRequest,
      version: '2.0'
    })
  }

  /**
   * Fetch a report for user weight changes for specific organization
   * @param weightChangeRequest must implement WeightChangeRequest
   * @returns Promise<WeightChangeResponse>
   */
  public fetchWeightChange(
    weightChangeRequest: WeightChangeRequest
  ): Promise<WeightChangeResponse> {
    return this.apiService.request({
      endpoint: '/warehouse/weight/change',
      method: 'GET',
      data: weightChangeRequest,
      version: '2.0'
    })
  }

  /**
   * Fetch a report for aggregate client age breakdown
   * @param ageDemographicsRequest must implement AgeDemographicsRequest
   * @returns Promise<Array<AgeDemographicsSegment>>
   */
  public fetchAgeDemographics(
    ageDemographicsRequest: AgeDemographicsRequest
  ): Promise<Array<AgeDemographicsSegment>> {
    return this.apiService
      .request({
        endpoint: '/warehouse/demographics/age',
        method: 'GET',
        data: ageDemographicsRequest,
        version: '2.0'
      })
      .then((response) => response.data)
  }

  /**
   * Fetch a report for aggregate client gender breakdown
   * @param genderDemographicsRequest must implement GenderDemographicsRequest
   * @returns Promise<Array<GenderDemographicsSegment>>
   */
  public fetchGenderDemographics(
    genderDemographicsRequest: GenderDemographicsRequest
  ): Promise<Array<GenderDemographicsSegment>> {
    return this.apiService
      .request({
        endpoint: '/warehouse/demographics/gender',
        method: 'GET',
        data: genderDemographicsRequest,
        version: '2.0'
      })
      .then((response) => response.data)
  }

  /**
   * Gets report with number of organization's providers that are active between specific dates.
   * @param providerCountRequest must implement ProviderCountRequest
   * @returns Promise<void>
   */
  public fetchProviderCount(
    providerCountRequest: ProviderCountRequest
  ): Promise<Array<ProviderCountSegment>> {
    return this.apiService
      .request({
        endpoint: '/warehouse/provider/count',
        method: 'GET',
        data: providerCountRequest,
        version: '2.0'
      })
      .then((response) => response.data)
  }

  /**
   * New and total patients count report based on package enrollments for given time range.
   * @param patientCountRequest must implement PatientCountRequest
   * @returns Promise<Array<PatientCountSegment>>
   */
  public fetchPatientCount(
    patientCountRequest: PatientCountRequest
  ): Promise<Array<PatientCountSegment>> {
    return this.apiService
      .request({
        endpoint: '/warehouse/enrollment/patient-count',
        method: 'GET',
        data: patientCountRequest,
        version: '2.0'
      })
      .then((response) => response.data)
  }

  /**
   * Fetch a report for a list of users with their phase(s).
   * The report will be presented in a tabular fashion, which means that each external identifier and phase will be listed in a separate row.
   * @param enrollmentSimpleRrequest must implement EnrollmentSimpleReportRequest
   * @returns Promise<EnrollmentSimpleReportResponse>
   */
  public fetchSimpleEnrollmentReport(
    enrollmentSimpleRrequest: EnrollmentSimpleReportRequest
  ): Promise<EnrollmentSimpleReportResponse> {
    return this.apiService.request({
      endpoint: '/warehouse/enrollment/simple',
      method: 'GET',
      data: enrollmentSimpleRrequest,
      version: '2.0'
    })
  }

  public fetchRPMBillingSummary(
    request: FetchRPMBillingSummaryRequest
  ): Promise<PagedResponse<RPMStateSummaryItem>> {
    return this.apiService.request({
      endpoint: '/warehouse/rpm/state/billing-summary',
      method: 'GET',
      data: request,
      version: '3.0',
      omitHeaders: ['organization']
    })
  }

  public fetchRPMSuperbill(
    request: FetchRPMBillingSummaryRequest
  ): Promise<Blob> {
    return this.apiService.request({
      endpoint: '/warehouse/rpm/state/billing-summary',
      headers: {
        Accept:
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      },
      method: 'GET',
      data: request,
      responseType: 'blob',
      version: '3.0'
    })
  }
}

export { Reports }
