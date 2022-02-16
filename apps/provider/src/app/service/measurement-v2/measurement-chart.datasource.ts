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
import { ContextService } from '@app/service/context.service'
import { chain, flatMap, slice, sortBy } from 'lodash'
import * as tinycolor from 'tinycolor2'
import { TranslateService } from '@ngx-translate/core'
import { generateChartTooltip } from './helpers'
import { MEASUREMENT_MAX_ENTRIES_PER_DAY } from './measurement.datasource'
import { DataPointEntry } from './model'

export class MeasurementChartDataSource extends ChartDataSource<
  MeasurementDataPointGroup,
  GetMeasurementDataPointGroupsRequest
> {
  public hasTooMuchForSingleDay = false
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
        sort: [{ property: 'recordedAt', dir: 'asc' }],
        type: syntheticData ? syntheticData.sourceTypeIds : [this.type]
      })
    )
  }

  public mapChart(result: MeasurementDataPointGroup[]): ChartData {
    const sortedResult = sortBy(result, (entry) =>
      moment(entry.recordedAt.utc).unix()
    )

    /**
     * Grouping by day and limiting the amount of entries per day
     */
    const preprocessedEntries = chain(sortedResult)
      .groupBy((entry) => moment(entry.createdAt.utc).format('YYYY-MM-DD'))
      .flatMap((group) => {
        if (group.length <= MEASUREMENT_MAX_ENTRIES_PER_DAY) {
          return group
        }

        this.hasTooMuchForSingleDay = true
        return slice(group, -MEASUREMENT_MAX_ENTRIES_PER_DAY, group.length)
      })
      .value()

    /**
     * We consider synthetic types (in which the sources can become grouped) and
     * then we flatten those groups
     */
    const dataPoints = preprocessedEntries.map((entry) =>
      parseWithSyntheticDataPointTypes<DataPointEntry, MinimalDataPointType>(
        entry.dataPoints.map((dataPoint) => ({
          ...dataPoint,
          createdAt: entry.recordedAt,
          kind: DataPointKind.Regular
        }))
      )
    )

    const flatDataPoints = chain(dataPoints)
      .flatMap((dataPointArray) =>
        flatMap(
          dataPointArray.map((dataPointEntry) =>
            dataPointEntry.kind === DataPointKind.Regular
              ? [dataPointEntry]
              : dataPointEntry.sources
          )
        )
      )
      .value()

    /**
     * We group by type ID in order to draw a different line
     * per each data point type
     */
    const groupedDataPoints = chain(flatDataPoints)
      .uniqBy((entry) => entry.id)
      .groupBy((entry) => entry.type.id)
      .toArray()
      .value()

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

    const startDate = moment(sortedResult[0]?.recordedAt.utc)
    const endDate = moment(
      sortedResult[sortedResult.length - 1]?.recordedAt.utc
    )
    const tickDuration = Math.round(
      moment.duration(endDate.diff(startDate)).asDays() / xMaxTicks - 2
    )

    const emptyGroup = this.createEmptyDateGroups({
      start:
        this.timeframe === 'alltime' && sortedResult.length
          ? moment(sortedResult[0].recordedAt.utc)
              .subtract(tickDuration, 'day')
              .toDate()
          : this.criteria.recordedAt.start,
      end:
        this.timeframe === 'alltime' && sortedResult.length
          ? moment(sortedResult[sortedResult.length - 1].recordedAt.utc)
              .add(tickDuration, 'day')
              .toDate()
          : this.criteria.recordedAt.end
    })

    const datasets = groupedDataPoints.map((group) => ({
      data: group.map((entry) => ({
        x: moment(entry.createdAt.utc).startOf('hour').format(xlabelFormat),
        y: convertToReadableFormat(
          entry.value,
          entry.type,
          this.context.user.measurementPreference
        ).toFixed(1)
      })),
      lineTension: 0
    }))

    const yCoords = datasets[0]?.data.map((entry) => Number(entry.y)) ?? []

    let min = Math.min(...yCoords) ?? 0
    let max = Math.max(...yCoords) ?? 0

    // round to multiples of 10 for > 100
    min = min > 100 ? Math.round(min / 10) * 10 : min
    max = max > 100 ? Math.round(max / 10) * 10 : max

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
      datasets: datasets,
      labels: [
        '',
        ...emptyGroup.map((dateGroup) =>
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
              if (!dataPoints.length) {
                return
              }

              const entry = dataPoints[tooltipItem.index][0]

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
          ],
          yAxes: [
            {
              ticks: {
                min: Math.max(0, Math.round(min - min * 0.1)),
                max: Math.round(max * 1.1)
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

  private createEmptyDateGroups({
    start,
    end
  }: {
    start: Date | string
    end: Date | string
  }): MeasurementDataPointGroup[] {
    const emptyGroups: MeasurementDataPointGroup[] = []
    const startDate = moment(start).startOf('day')
    const endDate = moment(end).endOf('day')

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
