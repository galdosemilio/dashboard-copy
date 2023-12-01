import { Injectable } from '@angular/core'
import {
  BillingCode,
  FetchCareManagementBillingCodesRequest,
  FetchCareManagementBillingMonthRequest,
  FetchCareManagementBillingMonthResponse,
  FetchCareManagementBillingSnapshotRequest,
  FetchCareManagementBillingSnapshotResponse,
  Reports
} from '@coachcare/sdk'

import { CcrDatabase } from '@app/shared/model'
import {
  EnrollmentSimpleReportRequest,
  EnrollmentSimpleReportResponse,
  EnrollmentTimelineRequest,
  EnrollmentTimelineSegment,
  FetchRPMBillingSummaryRequest,
  FetchRPMMonthlyBillingSummaryRequest,
  FetchRPMMonthlyBillingSummaryResponse,
  PagedResponse,
  PatientCountRequest,
  PatientCountSegment,
  RPMStateSummaryItem,
  SignupsTimelineRequest,
  SignupsTimelineSegment
} from '@coachcare/sdk'

@Injectable()
export class ReportsDatabase extends CcrDatabase {
  constructor(private reports: Reports) {
    super()
  }

  // fetchEnrollmentReport(
  //   args: EnrollmentReportRequest
  // ): Promise<EnrollmentReportResponse> {
  //   const request: EnrollmentReportRequest = {
  //     organization: args.organization,
  //     date: args.date,
  //     includeInactiveEnrollments: args.includeInactiveEnrollments ? args.includeInactiveEnrollments : undefined,
  //     includeInactivePackages: args.includeInactivePackages ? args.includeInactivePackages : undefined,
  //   };

  //   return this.reports.fetchEnrollmentReport(request);
  // }

  fetchEnrollmentTimelineReport(
    args: EnrollmentTimelineRequest
  ): Promise<Array<EnrollmentTimelineSegment>> {
    const request: EnrollmentTimelineRequest = {
      organization: args.organization,
      startDate: args.startDate,
      endDate: args.endDate,
      detailed: args.detailed ? args.detailed : true,
      unit: args.unit ? args.unit : undefined
    }

    return this.reports.fetchEnrollmentTimeline(request)
  }

  fetchSignupsTimelineReport(
    args: SignupsTimelineRequest
  ): Promise<Array<SignupsTimelineSegment>> {
    const request: SignupsTimelineRequest = {
      organization: args.organization,
      startDate: args.startDate,
      endDate: args.endDate,
      detailed: args.detailed ? args.detailed : true,
      unit: args.unit ? args.unit : undefined
    }

    return this.reports.fetchSignupsTimeline(request)
  }

  fetchPatientCount(
    args: PatientCountRequest
  ): Promise<Array<PatientCountSegment>> {
    const request: PatientCountRequest = {
      organization: args.organization,
      startDate: args.startDate,
      endDate: args.endDate,
      package: args.package ? args.package : undefined,
      unit: args.unit ? args.unit : undefined,
      mode: args.mode ? args.mode : undefined
    }

    return this.reports.fetchPatientCount(request)
  }

  public fetchSimpleEnrollmentReport(
    args: EnrollmentSimpleReportRequest
  ): Promise<EnrollmentSimpleReportResponse> {
    const request: EnrollmentSimpleReportRequest = {
      organization: args.organization,
      range: args.range,
      pkg: args.pkg ? args.pkg : undefined,
      enrollmentLimit: args.enrollmentLimit ? args.enrollmentLimit : undefined,
      limit: args.limit ? args.limit : undefined,
      offset: args.offset ? args.offset : undefined
    }
    return this.reports.fetchSimpleEnrollmentReport(request)
  }

  public fetchRPMBillingReport(
    args: FetchRPMBillingSummaryRequest
  ): Promise<PagedResponse<RPMStateSummaryItem>> {
    return this.reports.fetchRPMBillingSummary(args)
  }

  public fetchCareManagementBillingMonthReport(
    args: FetchCareManagementBillingMonthRequest
  ): Promise<FetchCareManagementBillingMonthResponse> {
    return this.reports.fetchCareManagementBillingMonth(args)
  }

  public fetchCareManagementBillingSnapshot(
    args: FetchCareManagementBillingSnapshotRequest
  ): Promise<FetchCareManagementBillingSnapshotResponse> {
    return this.reports.fetchCareManagementBillingSnapshot(args)
  }

  public fetchRPMSuperbillReport(
    args: FetchCareManagementBillingMonthRequest
  ): Promise<Blob> {
    return this.reports.fetchCareManagementSuperbill(args)
  }

  public fetchRpmMonthlyBillingReport(
    args: FetchRPMMonthlyBillingSummaryRequest
  ): Promise<FetchRPMMonthlyBillingSummaryResponse> {
    return this.reports.fetchRPMMonthlyBillingSummary(args)
  }

  public fetchCareManagementMonthlyBillingReport(
    args: FetchCareManagementBillingMonthRequest
  ): Promise<FetchCareManagementBillingMonthResponse> {
    return this.reports.fetchCareManagementBillingMonth(args)
  }

  public async fetchCareManagementBillingCodes(
    args: FetchCareManagementBillingCodesRequest
  ): Promise<BillingCode[]> {
    const res = await this.reports.fetchCareManagementBillingCodes(args)

    return res.data.filter(
      (entry) => entry.coverage !== 'measurement-data-transmissions'
    )
  }
}
