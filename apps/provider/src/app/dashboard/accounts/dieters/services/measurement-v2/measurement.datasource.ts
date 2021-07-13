import { TableDataSource } from '@app/shared'
import {
  GetMeasurementDataPointGroupsRequest,
  GetMeasurementDataPointGroupsResponse,
  MeasurementDataPointGroup
} from '@coachcare/sdk'
import { from, Observable } from 'rxjs'
import { MeasurementDatabaseV2 } from './measurement.database'
import * as moment from 'moment'
import { flatMap } from 'lodash'

export interface MeasurementDataPointGroupTableEntry
  extends MeasurementDataPointGroup {
  isEmpty?: boolean
  shouldShowDate?: boolean
}

export class MeasurementDataSourceV2 extends TableDataSource<
  MeasurementDataPointGroupTableEntry,
  GetMeasurementDataPointGroupsResponse,
  GetMeasurementDataPointGroupsRequest
> {
  constructor(protected database: MeasurementDatabaseV2) {
    super()
  }

  public defaultFetch(): GetMeasurementDataPointGroupsResponse {
    return { data: [], pagination: {} }
  }

  public fetch(
    criteria: GetMeasurementDataPointGroupsRequest
  ): Observable<GetMeasurementDataPointGroupsResponse> {
    return from(this.database.fetch(criteria))
  }

  public mapResult(
    response: GetMeasurementDataPointGroupsResponse
  ): MeasurementDataPointGroupTableEntry[] {
    const emptyDateGroups = this.createEmptyDateGroups()

    return flatMap(emptyDateGroups, (dateGroup) => {
      const existingGroups = response.data.filter((group) =>
        moment(group.recordedAt.utc).isSame(
          moment(dateGroup.recordedAt.utc),
          'day'
        )
      )

      if (!existingGroups.length) {
        return [dateGroup]
      }

      return [dateGroup, ...existingGroups]
    })
      .map((group, idx, groups) => [group, groups[idx - 1]])
      .map(([current, previous]) => {
        const currentDate = moment(current.recordedAt.utc)
        const shouldShowDate = previous?.recordedAt.utc
          ? !currentDate.isSame(previous?.recordedAt.utc, 'day')
          : true
        return { ...current, shouldShowDate }
      })
  }

  private createEmptyDateGroups(): MeasurementDataPointGroupTableEntry[] {
    const emptyGroups: MeasurementDataPointGroupTableEntry[] = []
    const startDate = moment(this.criteria.recordedAt.start)
    const endDate = moment(this.criteria.recordedAt.end)

    let currentDate = startDate

    while (currentDate.isBefore(endDate)) {
      emptyGroups.push({
        shouldShowDate: true,
        account: { id: this.criteria.account },
        id: 'empty-group',
        dataPoints: [],
        createdAt: {
          local: currentDate.toString(),
          utc: currentDate.toISOString(),
          timezone: ''
        },
        recordedAt: {
          local: currentDate.toString(),
          utc: currentDate.toISOString(),
          timezone: ''
        },
        source: { id: 'local', name: '' },
        isEmpty: true
      })

      currentDate = currentDate.add(1, 'day')
    }

    return emptyGroups
  }
}
