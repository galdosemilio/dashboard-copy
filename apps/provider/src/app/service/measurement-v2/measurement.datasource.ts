import { TableDataSource } from '@app/shared/model'
import {
  DataPointTypes,
  GenericSortProperty,
  GetMeasurementDataPointGroupsRequest,
  GetMeasurementDataPointGroupsResponse,
  MeasurementDataPointGroup,
  MeasurementDataPointTypeAssociation
} from '@coachcare/sdk'
import { from, Observable } from 'rxjs'
import {
  GetMeasurementDataPointGroupsRequestWithExtras,
  MeasurementDatabaseV2
} from './measurement.database'
import * as moment from 'moment'
import { flatMap, groupBy } from 'lodash'
import { CcrTableSortDirective } from '@app/shared'
import { measurementTableRowMapper } from './helpers'

export const MEASUREMENT_MAX_ENTRIES_PER_DAY = 24
export const MEASUREMENT_MAX_ENTRIES_PER_DAY_DAY_CHART_VIEW_ONLY = 100
export const LOAD_MORE_ROW_BASE = Object.freeze({
  shouldShowDate: false,
  isLoadMore: true,
  account: { id: '' },
  id: 'empty-group',
  dataPoints: [],
  createdAt: {
    local: '',
    utc: '',
    timezone: ''
  },
  recordedAt: {
    local: '',
    utc: '',
    timezone: ''
  },
  source: { id: 'local', name: '' },
  isEmpty: true,
  canBeDeleted: false
})

export interface MeasurementDataPointGroupTableEntry
  extends MeasurementDataPointGroup {
  canBeDeleted?: boolean
  isEmpty?: boolean
  isLoadMore?: boolean
  shouldShowDate?: boolean
  shouldShowTime?: boolean
}

export class MeasurementDataSourceV2 extends TableDataSource<
  MeasurementDataPointGroupTableEntry,
  GetMeasurementDataPointGroupsResponse,
  GetMeasurementDataPointGroupsRequestWithExtras
> {
  public dataPointTypes: MeasurementDataPointTypeAssociation[] = []
  public hasTooMuchForSingleDay = false
  public listView = false
  public omitEmptyDays = false
  public showDistanceNote = false

  constructor(
    protected database: MeasurementDatabaseV2,
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
        ] as GenericSortProperty<'recordedAt'>[]
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

    const blockedDataPointAssocIds = this.dataPointTypes
      .filter((assoc) => !assoc.provider.isModifiable)
      .map((assoc) => assoc.type.id)

    const emptyDateGroups = !this.omitEmptyDays
      ? this.createEmptyDateGroups()
      : this.createHeaderDateGroups(response.data)

    const flat = flatMap(emptyDateGroups, (dateGroup) => {
      let hasTooManyEntries = false
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
        hasTooManyEntries = true
        this.hasTooMuchForSingleDay = true
        existingGroups = existingGroups.slice(
          0,
          MEASUREMENT_MAX_ENTRIES_PER_DAY
        )
      }

      if (this.listView) {
        return existingGroups
      }

      const allGroups = [dateGroup, ...existingGroups]
      const lastExistingGroup = existingGroups[existingGroups.length - 1]
      const loadMoreGroup: MeasurementDataPointGroupTableEntry = {
        ...LOAD_MORE_ROW_BASE,
        account: { id: this.criteria.account },
        createdAt: lastExistingGroup?.createdAt ?? {
          local: '',
          utc: '',
          timezone: ''
        },
        recordedAt: lastExistingGroup?.recordedAt ?? {
          local: '',
          utc: '',
          timezone: ''
        }
      }

      return hasTooManyEntries ? [...allGroups, loadMoreGroup] : allGroups
    })
      .map((group, idx, groups) => [group, groups[idx - 1]])
      .map(([current, previous]) =>
        measurementTableRowMapper(
          [current, previous],
          blockedDataPointAssocIds,
          this.listView
        )
      )

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
