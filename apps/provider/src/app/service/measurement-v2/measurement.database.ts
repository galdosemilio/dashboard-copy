import { Injectable } from '@angular/core'
import { CcrDatabase } from '@app/shared/model'
import {
  GetMeasurementDataPointGroupsRequest,
  GetMeasurementDataPointGroupsResponse,
  MeasurementDataPointProvider
} from '@coachcare/sdk'
import * as moment from 'moment'

export interface GetMeasurementDataPointGroupsRequestWithExtras
  extends GetMeasurementDataPointGroupsRequest {
  useSnapshot?: boolean
}

@Injectable()
export class MeasurementDatabaseV2 extends CcrDatabase {
  constructor(private dataPoint: MeasurementDataPointProvider) {
    super()
  }

  public async fetch(
    criteria: GetMeasurementDataPointGroupsRequestWithExtras
  ): Promise<GetMeasurementDataPointGroupsResponse> {
    const today = moment().endOf('day')
    return this.dataPoint.getGroups({
      ...criteria,
      recordedAt: criteria.useSnapshot
        ? {
            start: today
              .clone()
              .subtract(2, 'years')
              .startOf('year')
              .toISOString(),
            end: today.toISOString()
          }
        : criteria.recordedAt
    })
  }
}
