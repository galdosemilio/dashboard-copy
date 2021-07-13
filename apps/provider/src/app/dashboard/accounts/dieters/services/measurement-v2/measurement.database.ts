import { Injectable } from '@angular/core'
import { CcrDatabase } from '@app/shared'
import {
  GetMeasurementDataPointGroupsRequest,
  GetMeasurementDataPointGroupsResponse,
  MeasurementDataPointProvider
} from '@coachcare/sdk'

@Injectable()
export class MeasurementDatabaseV2 extends CcrDatabase {
  constructor(private dataPoint: MeasurementDataPointProvider) {
    super()
  }

  public async fetch(
    criteria: GetMeasurementDataPointGroupsRequest
  ): Promise<GetMeasurementDataPointGroupsResponse> {
    return this.dataPoint.getGroups(criteria)
  }
}
