import { ChartData, ChartDataSource } from '@app/shared/model'
import {
  convertToReadableFormat,
  DataPointKind,
  GetMeasurementDataPointGroupsRequest,
  GetMeasurementDataPointGroupsResponse,
  MeasurementDataPointGroup,
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
import { ContextService } from '@app/service'
import { flatMap, groupBy, sortBy, uniqBy } from 'lodash'
import * as tinycolor from 'tinycolor2'
import { TranslateService } from '@ngx-translate/core'
import { generateChartTooltip } from './helpers'
import { DataPointEntry } from './model'

export class MeasurementChartDataSource extends ChartDataSource<
  MeasurementDataPointGroup,
  GetMeasurementDataPointGroupsRequest
> {
  public type: string
  public timeframe: string
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

    // formats
    let xlabelFormat
    let tooltipFormat
    let xMaxTicks

    switch (this.timeframe) {
      case 'day':
        xMaxTicks = 26
        xlabelFormat = 'h:mm a'
        tooltipFormat = 'ddd D h:mm a'
        break
      case 'month':
        xMaxTicks = 31
        xlabelFormat = 'MMM D'
        tooltipFormat = 'MMM D h:mm a'
        break
      case 'year':
        xMaxTicks = 12
        xlabelFormat = 'MMM YYYY'
        tooltipFormat = 'MMM DD, YYYY h:mm a'
        break
      case 'alltime':
        xMaxTicks = 18
        xlabelFormat = 'MMM DD, YYYY'
        tooltipFormat = 'MMM DD, YYYY'
        break
      case 'week':
      default:
        xMaxTicks = 11
        xlabelFormat = 'ddd D'
        tooltipFormat = 'ddd, MMM D h:mm a'
    }

    this.headings = sortedResult.map((entry) =>
      moment(entry.recordedAt.utc).format(tooltipFormat)
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
          x: moment(entry.createdAt.utc).startOf('hour').format(xlabelFormat),
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
          moment(dateGroup.recordedAt.utc).format(xlabelFormat)
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

              return `${generateChartTooltip(
                entry,
                this.context.user.measurementPreference,
                this.translate.currentLang
              )}`
            }
          }
        },
        scales: {
          xAxes: [
            {
              ticks: {
                maxTicksLimit: xMaxTicks
              }
            }
          ]
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

      currentDate = currentDate.add(
        1,
        this.timeframe === 'day' ? 'hour' : 'day'
      )
    }

    return emptyGroups
  }
}
