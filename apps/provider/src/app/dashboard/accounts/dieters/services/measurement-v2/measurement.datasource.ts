import { TableDataSource } from '@app/shared'
import {
  DataPointTypes,
  GetMeasurementDataPointGroupsRequest,
  GetMeasurementDataPointGroupsResponse,
  MeasurementDataPointGroup
} from '@coachcare/sdk'
import { from, Observable } from 'rxjs'
import { MeasurementDatabaseV2 } from './measurement.database'
import * as moment from 'moment'
import { flatMap } from 'lodash'
import { MeasurementLabelService } from '@app/service'
import { MAX_ENTRIES_PER_DAY } from '../measurement/measurement.datasource'

export interface MeasurementDataPointGroupTableEntry
  extends MeasurementDataPointGroup {
  canBeDeleted?: boolean
  isEmpty?: boolean
  shouldShowDate?: boolean
}

export class MeasurementDataSourceV2 extends TableDataSource<
  MeasurementDataPointGroupTableEntry,
  GetMeasurementDataPointGroupsResponse,
  GetMeasurementDataPointGroupsRequest
> {
  public hasTooMuchForSingleDay = false
  public showDistanceNote = false

  constructor(
    protected database: MeasurementDatabaseV2,
    private measurementLabel: MeasurementLabelService
  ) {
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
    this.hasTooMuchForSingleDay = false
    this.showDistanceNote = false

    const blockedDataPointAssocIds = this.measurementLabel.dataPointTypes
      .filter((assoc) => !assoc.provider.isModifiable)
      .map((assoc) => assoc.type.id)
    const emptyDateGroups = this.createEmptyDateGroups()
    const flat = flatMap(emptyDateGroups, (dateGroup) => {
      let existingGroups = response.data.filter((group) =>
        moment(group.recordedAt.utc).isSame(
          moment(dateGroup.recordedAt.utc),
          'day'
        )
      )

      if (!existingGroups.length) {
        return [dateGroup]
      }

      if (existingGroups.length > MAX_ENTRIES_PER_DAY) {
        this.hasTooMuchForSingleDay = true
        existingGroups = existingGroups.slice(0, MAX_ENTRIES_PER_DAY)
      }

      return [dateGroup, ...existingGroups]
    })
      .map((group, idx, groups) => [group, groups[idx - 1]])
      .map(([current, previous]) => {
        const currentDate = moment(current.recordedAt.utc)
        const shouldShowDate = previous?.recordedAt.utc
          ? !currentDate.isSame(previous?.recordedAt.utc, 'day')
          : true
        const canBeDeleted = current.dataPoints.some(
          (dataPoint) => !blockedDataPointAssocIds.includes(dataPoint.type.id)
        )
        return { ...current, shouldShowDate, canBeDeleted }
      })

    this.showDistanceNote = flat.some((entry) =>
      entry.dataPoints.some(
        (dataPoint) => dataPoint.type.id === DataPointTypes.STEPS
      )
    )

    return flat
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
        isEmpty: true,
        canBeDeleted: false
      })

      currentDate = currentDate.add(1, 'day')
    }

    return emptyGroups
  }
}
