import { Injectable } from '@angular/core'
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
    return this.measurement.getSummary({
      account,
      type
    })
  }
}
