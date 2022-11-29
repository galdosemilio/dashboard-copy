import { TableDataSource } from '@coachcare/backend/model'
import {
  GetMeasurementDataPointTypesRequest,
  GetMeasurementDataPointTypesResponse,
  MeasurementDataPointType
} from '@coachcare/sdk'
import { from, Observable } from 'rxjs'
import { DataPointDatabase } from './data-point.database'

export class DataPointDataSource extends TableDataSource<
  MeasurementDataPointType,
  GetMeasurementDataPointTypesResponse,
  GetMeasurementDataPointTypesRequest
> {
  constructor(protected database: DataPointDatabase) {
    super()
  }

  public defaultFetch(): GetMeasurementDataPointTypesResponse {
    return { data: [], pagination: {} }
  }

  public fetch(
    criteria: GetMeasurementDataPointTypesRequest
  ): Observable<GetMeasurementDataPointTypesResponse> {
    return from(this.database.fetch(criteria))
  }

  public mapResult(
    result: GetMeasurementDataPointTypesResponse
  ): MeasurementDataPointType[] {
    // pagination handling
    this.getTotal(result)

    return result.data
  }
}
