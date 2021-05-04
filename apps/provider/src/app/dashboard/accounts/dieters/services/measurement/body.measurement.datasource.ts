import { ContextService, NotifierService } from '@app/service'
import { CcrDataSource } from '@app/shared'
import {
  Entity,
  FetchBodyMeasurementRequest,
  FetchBodyMeasurementResponse
} from '@coachcare/sdk'
import { from, Observable } from 'rxjs'
import { BodyMeasurement } from '../../models/measurement/bodyMeasurement'
import { MeasurementDatabase } from './measurement.database'

export class BodyMeasurementDataSource extends CcrDataSource<
  BodyMeasurement,
  FetchBodyMeasurementResponse,
  FetchBodyMeasurementRequest
> {
  constructor(
    protected notify: NotifierService,
    protected database: MeasurementDatabase,
    protected context: ContextService
  ) {
    super()
  }

  defaultFetch(): FetchBodyMeasurementResponse {
    return { data: [] }
  }

  fetch(criteria): Observable<FetchBodyMeasurementResponse> {
    return from(this.database.fetchBodyMeasurement(criteria))
  }

  mapResult(result: FetchBodyMeasurementResponse) {
    return result.data.map(
      (item: any) =>
        new BodyMeasurement(item, {
          measurementPreference: this.context.user.measurementPreference
        })
    )
  }

  deleteBodyMeasurement(args: Entity): Promise<void> {
    return this.database.deleteBodyMeasurement(args)
  }
}
