import { baseData, CcrElement, DateRange, Timeframe } from '../../model'
import { createChart } from 'lightweight-charts'
import { eventService } from '@chart/service'
import { api } from '@chart/service/api'
import { DateTime } from 'luxon'
import {
  convertToReadableFormat,
  convertUnitToPreferenceFormat,
  MeasurementDataPointAggregate
} from '@coachcare/sdk'
import { groupBy } from 'lodash'
import { Subject } from 'rxjs'
import { auditTime, debounceTime, filter } from 'rxjs/operators'

export interface GraphEntry {
  value: number
  time: string
}

interface GraphTimeData {
  day: number
  month: number
  year: number
}

import './graph.element.scss'

export class GraphElement extends CcrElement {
  private chart
  private chartHeight = 400
  private chartTimeFormat = 'yyyy-MM-dd'
  private data: GraphEntry[] = []
  private dateRange: DateRange
  private isLoading: boolean
  private firstTime = true
  private lineSeries
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
    this.addLineSeries()
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
    this.lineSeries = this.chart.addLineSeries({
      priceFormat: {
        type: 'custom',
        precision: 1,
        minMove: 0.5,
        formatter: (value) =>
          value.toFixed() +
          ' ' +
          (api.baseData.dataPointType
            ? convertUnitToPreferenceFormat(
                api.baseData.dataPointType,
                api.baseData.metric
              )
            : '')
      },
      priceLineVisible: false,
      lastValueVisible: false,
      priceLineColor: api.baseData.colors.primary,
      color: baseData.colors.primary,
      lineWidth: 2
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
      timeScale: {
        lockVisibleTimeRangeOnResize: true,
        tickMarkFormatter: (time) => {
          const date = new Date(time.year, time.month, time.day)
          return (
            date.getFullYear() +
            '/' +
            (date.getMonth() + 1) +
            '/' +
            date.getDate()
          )
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
      if (!this.dateRange || this.isLoading) {
        return
      }

      this.isLoading = true

      const measurements = await api.measurementDataPoint.getAggregates({
        account: api.baseData.accountId || undefined,
        type: [api.baseData.dataPointTypeId],
        recordedAt: this.dateRange,
        limit: 'all',
        unit: 'day'
      })

      const emptyGroups = this.createEmptyDateGroups(this.dateRange)

      const groupedValues = groupBy(
        [...emptyGroups, ...measurements.data],
        (group) => group.bucket.date
      )

      const data: GraphEntry[] = Object.values(groupedValues).map((group) => {
        const filteredGroup = group.filter(
          (entry) => entry.point.id !== 'empty-group'
        )

        const hadEntries = filteredGroup.length > 0

        const lastEntry = hadEntries ? filteredGroup.pop() : group.pop()

        return {
          time: DateTime.fromISO(lastEntry.bucket.timestamp)
            .minus({ month: 1 })
            .toFormat(this.chartTimeFormat),
          value: hadEntries
            ? convertToReadableFormat(
                lastEntry.point.value,
                lastEntry.point.type,
                baseData.metric
              )
            : undefined
        }
      })

      this.data = append ? this.data.concat(data) : data.concat(this.data)

      this.lineSeries.setData(this.data.map((entry) => ({ ...entry })))

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
          timezone: '',
          timestamp: currentDate.toISO(),
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

  private getEntriesBetweenRange(dateRange: DateRange): GraphEntry[] {
    const initialDate = DateTime.fromISO(dateRange.start).minus({ month: 1 })
    const finalDate = DateTime.fromISO(dateRange.end).minus({ month: 1 })

    return this.data.filter((entry) => {
      const entryDate = DateTime.fromISO(entry.time)
      return entryDate >= initialDate && entryDate <= finalDate
    })
  }

  private hasSameDateEntry(date: DateTime): boolean {
    return this.data.some((entry) => {
      const entryDate = DateTime.fromISO(entry.time).plus({ month: 1 })
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
          this.data = []
          this.firstTime = true
          this.rangeChangeBumper = false
          this.dateRange = dateRange
          this.fetchMeasurements()
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

    const barsInfo = this.lineSeries.barsInLogicalRange(newVisibleLogicalRange)

    const fromLogical = this.chart
      .timeScale()
      .coordinateToLogical(newVisibleLogicalRange.from)

    let pivotDate: DateTime
    let endDate: DateTime
    let startDate: DateTime
    let append: boolean

    if (fromLogical < 0) {
      pivotDate = DateTime.fromISO(this.data[0].time).plus({ month: 1 })
      endDate = pivotDate.minus({ millisecond: 1 }).endOf(this.timeframe)
      startDate = pivotDate
        .minus({ [this.timeframe]: 1 })
        .startOf(this.timeframe)

      append = false

      if (this.hasSameDateEntry(endDate)) {
        this.reportSelectedDateRange(barsInfo)
        return
      }
    } else if (barsInfo?.barsAfter < 0) {
      pivotDate = DateTime.fromISO(this.data[this.data.length - 1].time)
        .plus({ month: 1 })
        .endOf(this.timeframe)
      endDate = pivotDate.plus({ [this.timeframe]: 1 }).endOf(this.timeframe)
      startDate = pivotDate.plus({ millisecond: 1 }).startOf(this.timeframe)
      append = true

      if (this.hasSameDateEntry(pivotDate) || startDate > DateTime.now()) {
        this.reportSelectedDateRange(barsInfo)
        return
      }
    } else {
      return
    }

    this.dateRange = {
      start: startDate.toISO(),
      end: endDate.toISO()
    }

    await this.fetchMeasurements(append)
    this.reportSelectedDateRange(barsInfo)
  }

  private reportSelectedDateRange(
    barsInfo: { from: GraphTimeData; to: GraphTimeData } | null
  ): void {
    if (!barsInfo) {
      return
    }

    const initial = DateTime.now()
      .set({
        day: barsInfo.from.day,
        month: barsInfo.from.month,
        year: barsInfo.from.year
      })
      .plus({ month: 1 })
      .startOf('day')
    const final = DateTime.now()
      .set({
        day: barsInfo.to.day,
        month: barsInfo.to.month,
        year: barsInfo.to.year
      })
      .plus({ month: 1 })
      .endOf('day')

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
