import { TableDataSource } from '@app/shared/model'
import {
  GetMeasurementDataPointAggregatesRequest,
  GetMeasurementDataPointAggregatesResponse,
  MeasurementDataPointAggregate
} from '@coachcare/sdk'
import { from, Observable } from 'rxjs'
import { MeasurementAggregatesDatabase } from './measurement-aggregates.database'

export class MeasurementAggregatesDataSource extends TableDataSource<
  MeasurementDataPointAggregate,
  GetMeasurementDataPointAggregatesResponse,
  GetMeasurementDataPointAggregatesRequest
> {
  constructor(protected database: MeasurementAggregatesDatabase) {
    super()
  }

  public defaultFetch(): GetMeasurementDataPointAggregatesResponse {
    return { data: [], pagination: {} }
  }

  public fetch(
    criteria: GetMeasurementDataPointAggregatesRequest
  ): Observable<GetMeasurementDataPointAggregatesResponse> {
    return from(this.database.fetch(criteria))
  }

  public mapResult(
    result: GetMeasurementDataPointAggregatesResponse
  ): MeasurementDataPointAggregate[] {
    return result.data
  }
}
