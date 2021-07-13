import { Injectable } from '@angular/core'
import { AppDatabase } from '@coachcare/backend/model'
import {
  GetMeasurementDataPointTypesRequest,
  GetMeasurementDataPointTypesResponse,
  MeasurementDataPointTypeProvider
} from '@coachcare/sdk'

@Injectable()
export class DataPointDatabase extends AppDatabase {
  constructor(private dataPoint: MeasurementDataPointTypeProvider) {
    super()
  }

  public fetch(
    criteria: GetMeasurementDataPointTypesRequest
  ): Promise<GetMeasurementDataPointTypesResponse> {
    return this.dataPoint.getAll(criteria)
  }
}
