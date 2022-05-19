import { Injectable } from '@angular/core'
import { CcrDatabase } from '@app/shared'
import {
  GetMeasurementDataPointAggregatesRequest,
  GetMeasurementDataPointAggregatesResponse,
  MeasurementDataPointProvider
} from '@coachcare/sdk'

@Injectable()
export class MeasurementAggregatesDatabase implements CcrDatabase {
  constructor(private dataPoint: MeasurementDataPointProvider) {}

  public fetch(
    criteria: GetMeasurementDataPointAggregatesRequest
  ): Promise<GetMeasurementDataPointAggregatesResponse> {
    return this.dataPoint.getAggregates(criteria)
  }
}
