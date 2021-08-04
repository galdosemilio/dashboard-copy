import './graph.element.scss'

import * as utils from '@chart/utils'

import {
  CcrElement,
  DateRange,
  MeasurementsEnum,
  Timeframe,
  baseData
} from '../../model'
import {
  MeasurementDataPointAggregate,
  convertToReadableFormat
} from '@coachcare/sdk'
import { auditTime, debounceTime, filter } from 'rxjs/operators'

import { DateTime } from 'luxon'
import { Subject } from 'rxjs'
import { api } from '@chart/service/api'
import { createChart } from 'lightweight-charts'
import { eventService } from '@chart/service'
import { groupBy } from 'lodash'

export interface GraphEntry {
  value: number
  time: string
}

interface GraphTimeData {
  day: number
  month: number
  year: number
}

export class GraphElement extends CcrElement {
  private chart
  private chartHeight = 400
  private chartTimeFormat = 'yyyy-MM-dd'
  private data: GraphEntry[][] = []
  private dateRange: DateRange
  private isLoading: boolean
  private isReady = false
  private firstTime = true
  private lineSeries = []
  private rangeChangeBumper = false
  private resizeChart$: Subject<void> = new Subject<void>()
  private timeframe: Timeframe
  private visibleLocalRangeChanged$: Subject<
    Record<string, unknown>
  > = new Subject<Record<string, unknown>>()

  constructor() {
    super()
    this.resizeChart = this.resizeChart.bind(this)
    this.onVisibleLogicalRangeChanged = this.onVisibleLogicalRangeChanged.bind(
      this
    )
  }

  onInit(): void {
    this.listenToEvents()
    this.listenToResizeEvent()
  }

  afterViewInit(): void {
    this.createChart()

    eventService.baseDataEvent$.subscribe(() => {
      this.isReady = true
      this.addLineSeries()
    })
  }

  render() {
    this.innerHTML = `
      <div id="graph-content">
        <dashboard-graph-timeframe-selector></dashboard-graph-timeframe-selector>
        <dashboard-graph-header></dashboard-graph-header>

        <div id="lightweight-chart-container"></div>
      </div>
    `
  }

  private addLineSeries(): void {
    api.baseData.dataPointTypes.forEach((type, index) => {
      const unit = utils.unit(type, api.baseData.metric)
      const color = Object.keys(api.baseData.colors)[index]

      const series = this.chart.addLineSeries({
        priceFormat: {
          type: 'custom',
          precision: 1,
          minMove:
            api.baseData.dataPointTypeId === MeasurementsEnum.SLEEP ? 60 : 0.5,
          formatter: (value) =>
            utils.formart(value, api.baseData.dataPointTypeId) + ' ' + unit
        },
        priceLineVisible: false,
        lastValueVisible: false,
        priceLineColor: api.baseData.colors[color],
        color: api.baseData.colors[color],
        lineWidth: 2
      })

      this.lineSeries.push(series)
    })
  }

  private createChart(): void {
    const chartContainer = document.getElementById(
      'lightweight-chart-container'
    )
    this.chart = createChart(chartContainer, {
      width: document.documentElement.clientWidth,
      height: this.chartHeight,
      layout: {
        fontFamily: 'Montserrat'
      },
      handleScale: {
        pinch: false
      },
      timeScale: {
        lockVisibleTimeRangeOnResize: true,
        tickMarkFormatter: (time) => {
          return DateTime.now().set(time).toFormat('yyyy/MM/dd')
        }
      }
    })

    this.chart
      .timeScale()
      .subscribeVisibleLogicalRangeChange((newVisibleLogicalRange) =>
        this.visibleLocalRangeChanged$.next(newVisibleLogicalRange)
      )
  }

  private async fetchMeasurements(append = true): Promise<void> {
    try {
      if (!this.isReady || !this.dateRange || this.isLoading) {
        return
      }

      this.isLoading = true

      const measurements = await api.measurementDataPoint.getAggregates({
        account: api.baseData.accountId || undefined,
        type: api.baseData.dataPointTypes.map((t) => t.id),
        recordedAt: this.dateRange,
        limit: 'all',
        unit: 'day'
      })

      const measurementMaps = api.baseData.dataPointTypes.map((type) =>
        measurements.data.filter((entry) => entry.point.type.id === type.id)
      )

      measurementMaps.forEach((values, index) => {
        const emptyGroups = this.createEmptyDateGroups(this.dateRange)
        const groupedValues = groupBy([...emptyGroups, ...values], (group) =>
          DateTime.fromISO(group.bucket.timestamp).toFormat(
            this.chartTimeFormat
          )
        )

        const data: GraphEntry[] = Object.values(groupedValues).map((group) => {
          const filteredGroup = group.filter(
            (entry) => entry.point.id !== 'empty-group'
          )

          const hadEntries = filteredGroup.length > 0

          const lastEntry = hadEntries
            ? filteredGroup[filteredGroup.length - 1]
            : group[group.length - 1]

          return {
            time: DateTime.fromISO(lastEntry.bucket.timestamp).toFormat(
              this.chartTimeFormat
            ),
            value: hadEntries
              ? convertToReadableFormat(
                  lastEntry.point.value,
                  lastEntry.point.type,
                  baseData.metric
                )
              : undefined
          }
        })

        const initalData = this.data[index] || []

        this.data[index] = append
          ? initalData.concat(data)
          : data.concat(initalData)
        this.lineSeries[index].setData(
          this.data[index].map((entry) => ({ ...entry }))
        )
      })

      if (!this.firstTime) {
        return
      }

      this.chart.timeScale().setVisibleRange({
        from: DateTime.fromISO(this.dateRange.start).toFormat(
          this.chartTimeFormat
        ),
        to: DateTime.fromISO(this.dateRange.end).toFormat(this.chartTimeFormat)
      })

      this.chart.timeScale().fitContent()
      eventService.trigger(
        'graph.data',
        this.getEntriesBetweenRange(this.dateRange)
      )
      this.firstTime = false
      this.rangeChangeBumper = true

      // TODO: investigate how to detect that the chart has finished resizing
      setTimeout(() => {
        this.rangeChangeBumper = false
      }, 1500)
    } catch (error) {
      console.error(error)
    } finally {
      this.isLoading = false
    }
  }

  private createEmptyDateGroups(
    dateRange: DateRange
  ): MeasurementDataPointAggregate[] {
    const emptyGroups: MeasurementDataPointAggregate[] = []
    const startDate = DateTime.fromISO(dateRange.start)
    const endDate = DateTime.fromISO(dateRange.end)

    let currentDate = startDate

    while (currentDate.hasSame(endDate, 'day') || currentDate < endDate) {
      emptyGroups.push({
        bucket: {
          date: currentDate.toFormat(this.chartTimeFormat),
          timezone: api.baseData.timezone,
          timestamp: currentDate.toUTC().toISO(),
          unit: 'day'
        },
        operation: 'last',
        point: {
          id: 'empty-group',
          createdAt: {
            local: currentDate.toISO(),
            utc: currentDate.toISO(),
            timezone: ''
          },
          type: undefined,
          value: undefined,
          group: undefined
        }
      })

      currentDate = currentDate.plus({ day: 1 })
    }

    return emptyGroups
  }

  private getEntriesBetweenRange(dateRange: DateRange): GraphEntry[][] {
    const initialDate = DateTime.fromISO(dateRange.start)
    const finalDate = DateTime.fromISO(dateRange.end)

    return this.data.map((entries) =>
      entries.filter((entry) => {
        const entryDate = DateTime.fromISO(entry.time)
        return entryDate >= initialDate && entryDate <= finalDate
      })
    )
  }

  private hasSameDateEntry(date: DateTime): boolean {
    return this.data
      .reduce((enties, current) => {
        return enties.concat(current)
      }, [])
      .some((entry) => {
        const entryDate = DateTime.fromISO(entry.time)
        return (
          date.hasSame(entryDate, 'day') &&
          date.hasSame(entryDate, 'month') &&
          date.hasSame(entryDate, 'year')
        )
      })
  }

  private listenToEvents(): void {
    this.subscriptions.push(
      eventService
        .listen<DateRange>('graph.date-range')
        .pipe(debounceTime(700))
        .subscribe((dateRange) => {
          if (api.baseData.token) {
            this.data = []
            this.firstTime = true
            this.rangeChangeBumper = false
            this.dateRange = dateRange
            this.fetchMeasurements()
          }
        }),
      eventService
        .listen<Timeframe>('graph.timeframe')
        .subscribe((timeframe) => (this.timeframe = timeframe)),
      eventService.baseDataEvent$.subscribe(() => this.fetchMeasurements()),
      this.resizeChart$
        .pipe(
          debounceTime(1000),
          filter(() => !!this.chart)
        )
        .subscribe(this.resizeChart),
      this.visibleLocalRangeChanged$
        .pipe(
          filter(() => !this.isLoading && !this.rangeChangeBumper),
          auditTime(300)
        )
        .subscribe(this.onVisibleLogicalRangeChanged)
    )
  }

  private listenToResizeEvent(): void {
    window.addEventListener('resize', () => this.resizeChart$.next())
  }

  private async onVisibleLogicalRangeChanged(
    newVisibleLogicalRange
  ): Promise<void> {
    if (!this.data?.length) {
      return
    }

    const barsInfo = this.lineSeries[0].barsInLogicalRange(
      newVisibleLogicalRange
    )

    const fromLogical = this.chart
      .timeScale()
      .coordinateToLogical(newVisibleLogicalRange.from)

    let pivotDate: DateTime
    let endDate: DateTime
    let startDate: DateTime
    let append: boolean

    if (fromLogical < 0) {
      pivotDate = DateTime.fromISO(this.data[0][0].time)
      endDate = pivotDate.minus({ day: 1 }).endOf('day')
      startDate = endDate
        .minus({ [this.timeframe]: 1 })
        .plus({ day: 1 })
        .startOf('day')

      append = false

      if (this.hasSameDateEntry(endDate)) {
        this.reportSelectedDateRange()
        return
      }
    } else if (barsInfo?.barsAfter < 0) {
      pivotDate = DateTime.fromISO(this.data[0][this.data[0].length - 1].time)
      startDate = pivotDate.plus({ day: 1 }).startOf('day')
      endDate = pivotDate.plus({ [this.timeframe]: 1 }).endOf('day')
      append = true

      if (this.hasSameDateEntry(pivotDate) || startDate > DateTime.now()) {
        this.reportSelectedDateRange()
        return
      }
    } else {
      this.reportSelectedDateRange()
      return
    }

    this.dateRange = {
      start: startDate.toISO(),
      end: endDate.toISO()
    }

    await this.fetchMeasurements(append)
    this.reportSelectedDateRange()
  }

  private reportSelectedDateRange(): void {
    const range = this.chart.timeScale().getVisibleRange()

    if (!range) {
      return
    }

    const initial = DateTime.now()
      .set({
        day: range.from.day,
        month: range.from.month,
        year: range.from.year
      })
      .startOf('day')

    const final = DateTime.now()
      .set({
        day: range.to.day,
        month: range.to.month,
        year: range.to.year
      })
      .endOf('day')

    const timeRange = {
      start: final
        .minus({ [this.timeframe]: 1 })
        .plus({ day: 1 })
        .startOf('day')
        .toISO(),
      end: final.toISO()
    }

    eventService.trigger('graph.date-range-change', timeRange)

    eventService.trigger(
      'graph.data',
      this.getEntriesBetweenRange({
        start: initial.toISO(),
        end: final.toISO()
      })
    )
  }

  private resizeChart(): void {
    this.chart.resize(document.documentElement.clientWidth, this.chartHeight)
  }
}

customElements.define('dashboard-graph', GraphElement)
