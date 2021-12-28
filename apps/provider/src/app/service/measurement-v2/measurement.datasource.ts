import { TableDataSource } from '@app/shared/model'
import {
  DataPointTypes,
  GetMeasurementDataPointGroupsRequest,
  GetMeasurementDataPointGroupsResponse,
  MeasurementDataPointGroup,
  SortProperty
} from '@coachcare/sdk'
import { from, Observable } from 'rxjs'
import {
  GetMeasurementDataPointGroupsRequestWithExtras,
  MeasurementDatabaseV2
} from './measurement.database'
import * as moment from 'moment'
import { flatMap, groupBy } from 'lodash'
import { MeasurementLabelService } from '@app/service'
import { CcrTableSortDirective } from '@app/shared'

export const MEASUREMENT_MAX_ENTRIES_PER_DAY = 24

export interface MeasurementDataPointGroupTableEntry
  extends MeasurementDataPointGroup {
  canBeDeleted?: boolean
  isEmpty?: boolean
  shouldShowDate?: boolean
}

export class MeasurementDataSourceV2 extends TableDataSource<
  MeasurementDataPointGroupTableEntry,
  GetMeasurementDataPointGroupsResponse,
  GetMeasurementDataPointGroupsRequestWithExtras
> {
  public hasTooMuchForSingleDay = false
  public omitEmptyDays = false
  public showDistanceNote = false

  constructor(
    protected database: MeasurementDatabaseV2,
    private measurementLabel: MeasurementLabelService,
    private sort?: CcrTableSortDirective
  ) {
    super()

    if (this.sort) {
      this.addOptional(this.sort.sortChange, () => ({
        sort: [
          {
            property: this.sort.active || 'recordedAt',
            dir: this.sort.direction || 'asc'
          }
        ] as SortProperty[]
      }))
    }
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
    this.total = response.pagination.next
      ? response.pagination.next + 1
      : this.criteria.offset + response.data.length

    this.hasTooMuchForSingleDay = false
    this.showDistanceNote = false

    const blockedDataPointAssocIds = this.measurementLabel.dataPointTypes
      .filter((assoc) => !assoc.provider.isModifiable)
      .map((assoc) => assoc.type.id)
    const emptyDateGroups = !this.omitEmptyDays
      ? this.createEmptyDateGroups()
      : this.createHeaderDateGroups(response.data)

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

      if (existingGroups.length > MEASUREMENT_MAX_ENTRIES_PER_DAY) {
        this.hasTooMuchForSingleDay = true
        existingGroups = existingGroups.slice(
          0,
          MEASUREMENT_MAX_ENTRIES_PER_DAY
        )
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

    if (
      this.criteria.sort &&
      this.criteria.sort[0]?.property === 'recordedAt' &&
      this.criteria.sort[0]?.dir === 'desc'
    ) {
      emptyGroups.reverse()
    }

    return emptyGroups
  }

  private createHeaderDateGroups(
    entries: MeasurementDataPointGroup[]
  ): MeasurementDataPointGroupTableEntry[] {
    return Object.values(
      groupBy(entries, (entry) =>
        moment(entry.recordedAt.utc).startOf('day').toISOString()
      )
    ).map((entryGroup) => {
      const currentDate = moment(entryGroup.shift().recordedAt.utc).startOf(
        'day'
      )

      return {
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
      }
    })
  }
}
