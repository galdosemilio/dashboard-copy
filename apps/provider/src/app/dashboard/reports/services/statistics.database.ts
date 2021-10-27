import { Injectable } from '@angular/core'
import { Reports } from '@coachcare/sdk'

import { CcrDatabase } from '@app/shared/model'
import {
  ActivityLevelRequest,
  ActivityLevelSegment,
  AgeDemographicsRequest,
  AgeDemographicsSegment,
  GenderDemographicsRequest,
  GenderDemographicsSegment,
  MeasurementCohortReportRequest,
  MeasurementCohortReportResponse,
  OrganizationActivityAggregate,
  OrganizationActivityRequest,
  ProviderCountRequest,
  ProviderCountSegment,
  SleepReportRequest,
  SleepReportResponse,
  WeightChangeRequest,
  WeightChangeResponse
} from '@coachcare/sdk'

@Injectable()
export class StatisticsDatabase extends CcrDatabase {
  constructor(private reports: Reports) {
    super()
  }

  fetchGenderDemographics(
    args: GenderDemographicsRequest
  ): Promise<Array<GenderDemographicsSegment>> {
    return this.reports.fetchGenderDemographics(args)
  }

  fetchAgeDemographics(
    args: AgeDemographicsRequest
  ): Promise<Array<AgeDemographicsSegment>> {
    return this.reports.fetchAgeDemographics(args)
  }

  fetchActivityLevel(
    args: ActivityLevelRequest
  ): Promise<Array<ActivityLevelSegment>> {
    return this.reports.fetchActivityLevel(args)
  }

  fetchOrganizationActivity(
    args: OrganizationActivityRequest
  ): Promise<Array<OrganizationActivityAggregate>> {
    return this.reports.fetchOrganizationActivity(args)
  }

  fetchWeightChange(args: WeightChangeRequest): Promise<WeightChangeResponse> {
    return this.reports.fetchWeightChange(args)
  }

  fetchSleep(args: SleepReportRequest): Promise<SleepReportResponse> {
    return this.reports.fetchSleep(args)
  }

  fetchProviderCount(
    args: ProviderCountRequest
  ): Promise<Array<ProviderCountSegment>> {
    return this.reports.fetchProviderCount(args)
  }

  fetchMeasurementCohortReport(
    args: MeasurementCohortReportRequest
  ): Promise<MeasurementCohortReportResponse> {
    return this.reports.fetchMeasurementCohortReport(args)
  }
}
