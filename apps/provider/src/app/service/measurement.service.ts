import { Injectable } from '@angular/core'
import moment from 'moment-timezone'
import {
  GetMeasurementDataPointSummaryResponse,
  MeasurementDataPointProvider
} from '@coachcare/sdk'

@Injectable({ providedIn: 'root' })
export class MeasurementService {
  constructor(private measurement: MeasurementDataPointProvider) {}

  public async getSummary({
    account,
    type
  }: {
    account: string
    type: string[]
  }): Promise<GetMeasurementDataPointSummaryResponse> {
    const end = moment().endOf('day')
    const start = end
      .clone()
      .subtract(1, 'month')
      .add('1', 'day')
      .startOf('day')

    return this.measurement.getSummary({
      account,
      type,
      recordedAt: {
        start: start.toISOString(),
        end: end.toISOString()
      }
    })
  }
}
