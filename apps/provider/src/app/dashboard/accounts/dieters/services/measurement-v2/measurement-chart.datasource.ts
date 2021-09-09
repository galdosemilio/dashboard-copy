import { ChartData, ChartDataSource } from '@app/shared'
import {
  convertUnitToPreferenceFormat,
  DataPoint,
  DataPointKind,
  GetMeasurementDataPointGroupsRequest,
  GetMeasurementDataPointGroupsResponse,
  MeasurementDataPointGroup,
  MeasurementDataPointMinimalType,
  MeasurementDataPointTimestamp,
  MinimalDataPointType,
  parseWithSyntheticDataPointTypes,
  SYNTHETIC_TYPES
} from '@coachcare/sdk'
import { from, Observable } from 'rxjs'
import { MeasurementDatabaseV2 } from './measurement.database'
import * as moment from 'moment'
import { select, Store } from '@ngrx/store'
import { CCRConfig, CCRPalette } from '@app/config'
import { paletteSelector } from '@app/store/config'
import { convertToReadableFormat } from '@coachcare/sdk'
import { ContextService } from '@app/service'
import { flatMap, groupBy, sortBy, uniqBy } from 'lodash'
import * as tinycolor from 'tinycolor2'
import { TranslateService } from '@ngx-translate/core'

interface DataPointEntry {
  createdAt: MeasurementDataPointTimestamp
  id: string
  kind: DataPointKind
  removedAt?: MeasurementDataPointTimestamp
  type: MeasurementDataPointMinimalType
  value: number
}

export class MeasurementChartDataSource extends ChartDataSource<
  MeasurementDataPointGroup,
  GetMeasurementDataPointGroupsRequest
> {
  public type: string

  private headings: string[] = []
  private palette: CCRPalette

  constructor(
    protected database: MeasurementDatabaseV2,
    private store: Store<CCRConfig>,
    private context: ContextService,
    private translate: TranslateService
  ) {
    super()

    this.store.pipe(select(paletteSelector)).subscribe((palette) => {
      this.palette = palette
    })
  }

  public defaultFetch(): GetMeasurementDataPointGroupsResponse {
    return { data: [], pagination: {} }
  }

  public fetch(
    criteria: GetMeasurementDataPointGroupsRequest
  ): Observable<GetMeasurementDataPointGroupsResponse> {
    const syntheticData = Object.values(SYNTHETIC_TYPES).find((entry) =>
      entry.sourceTypeIds.includes(this.type)
    )
    return from(
      this.database.fetch({
        ...criteria,
        type: syntheticData ? syntheticData.sourceTypeIds : [this.type]
      })
    )
  }

  public mapChart(result: MeasurementDataPointGroup[]): ChartData {
    const data = result.map((entry) =>
      parseWithSyntheticDataPointTypes<DataPointEntry, MinimalDataPointType>(
        entry.dataPoints.map((dataPoint) => ({
          ...dataPoint,
          createdAt: entry.recordedAt,
          kind: DataPointKind.Regular
        }))
      )
    )

    const flatData = flatMap(
      data.map((entry) =>
        flatMap(
          entry.map((dataEntry) =>
            dataEntry.kind === DataPointKind.Regular
              ? [dataEntry]
              : dataEntry.sources
          )
        )
      )
    )

    const groupedData = groupBy(
      sortBy(
        uniqBy(flatData, (entry) => entry.id),
        (entry) => moment(entry.createdAt.utc).unix()
      ),
      (entry) => entry.type.id
    )

    const sortedResult = sortBy(result, (entry) =>
      moment(entry.recordedAt.utc).unix()
    )
    this.headings = sortedResult.map((entry) =>
      moment(entry.recordedAt.utc).format('ddd D')
    )

    const chart: ChartData = {
      colors: [
        {
          borderColor: this.palette.accent,
          pointBackgroundColor: this.palette.primary
        },
        {
          borderColor: this.palette.accent,
          pointBackgroundColor: tinycolor(this.palette.primary).lighten(20),
          backgroundColor: 'transparent'
        }
      ],
      datasets: Object.values(groupedData).map((group) => ({
        data: group.map((entry) => ({
          x: moment(entry.createdAt.utc).format('ddd D'),
          y: convertToReadableFormat(
            entry.value,
            entry.type,
            this.context.user.measurementPreference
          ).toFixed(1)
        })),
        lineTension: 0
      })),
      labels: [
        '',
        ...this.createEmptyDateGroups().map((dateGroup) =>
          moment(dateGroup.recordedAt.utc).format('ddd D')
        ),
        ''
      ],
      options: {
        tooltips: {
          type: 'index',
          callbacks: {
            title: (tooltipItem) =>
              this.headings[tooltipItem[0].index]
                ? this.headings[tooltipItem[0].index]
                : '',
            label: (tooltipItem) => {
              if (!data.length) {
                return
              }

              const entry = data[tooltipItem.index][0]

              return `${
                entry.kind === DataPointKind.Regular
                  ? [this.getTooltipFromDataPoint(entry)]
                  : entry.sources
                      .map((source) => this.getTooltipFromDataPoint(source))
                      .join(' / ')
              }`
            }
          }
        }
      },
      legend: true,
      type: 'line'
    }

    return chart
  }

  public mapResult(
    response: GetMeasurementDataPointGroupsResponse
  ): MeasurementDataPointGroup[] {
    return response.data
  }

  private createEmptyDateGroups(): MeasurementDataPointGroup[] {
    const emptyGroups: MeasurementDataPointGroup[] = []
    const startDate = moment(this.criteria.recordedAt.start)
    const endDate = moment(this.criteria.recordedAt.end)

    let currentDate = startDate

    while (currentDate.isSameOrBefore(endDate)) {
      emptyGroups.push({
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
        source: { id: 'local', name: 'local' }
      })

      currentDate = currentDate.add(1, 'day')
    }

    return emptyGroups
  }

  private getTooltipFromDataPoint(
    dataPoint: DataPoint<DataPointEntry, MinimalDataPointType>
  ): string {
    return `${convertToReadableFormat(
      dataPoint.value,
      dataPoint.type,
      this.context.user.measurementPreference
    ).toFixed(1)} ${convertUnitToPreferenceFormat(
      dataPoint.type,
      this.context.user.measurementPreference,
      this.translate.currentLang
    )}`
  }
}
