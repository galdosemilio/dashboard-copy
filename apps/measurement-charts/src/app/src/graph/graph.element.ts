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
import { merge, Subject } from 'rxjs'
import { api } from '@chart/service/api'
import { createChart } from 'lightweight-charts'
import { eventService } from '@chart/service'
import { groupBy, sortBy } from 'lodash'
import { translate } from '@chart/service/i18n'

export interface GraphEntry {
  value: number
  time: string
}

export class GraphElement extends CcrElement {
  private chart
  private chartHeightOffset = 275
  private chartTimeFormat = 'yyyy-MM-dd'
  private data: GraphEntry[][] = []
  private dateRange: DateRange
  private dateRangeButton: HTMLButtonElement
  private readonly EMPTY_PERIOD_TOLERANCE = 3
  private emptyPeriodCount = 0
  private hasEntries: boolean
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
  private scaleChart$: Subject<void> = new Subject<void>()

  constructor() {
    super()
    this.resizeChart = this.resizeChart.bind(this)
    this.onVisibleLogicalRangeChanged = this.onVisibleLogicalRangeChanged.bind(
      this
    )
    this.scaleChart = this.scaleChart.bind(this)
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

    this.dateRangeButton = document.querySelector('#previous-date-range-button')

    this.dateRangeButton.addEventListener('click', () => {
      if (this.dateRangeButton.classList.contains('disabled')) {
        return
      }

      this.setDateRangeButtonState(false)
      eventService.trigger('graph.date-range-previous')
    })
  }

  render() {
    this.innerHTML = `
      <div id="graph-content">
        <dashboard-graph-timeframe-selector></dashboard-graph-timeframe-selector>
        <dashboard-date-range-selector></dashboard-date-range-selector>
        <dashboard-graph-header id="graph-header-container"></dashboard-graph-header>

        <p class="hidden" id="empty-data-error">${translate(
          'NO_DATA_CHOOSE_DIFF_RANGE'
        )}<br/><br/>
        <span id="previous-date-range-button">${translate(
          'GO_TO_PREVIOUS_DATE_RANGE'
        )}</span>
        </p>
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
      height: document.documentElement.clientHeight - this.chartHeightOffset,
      layout: {
        fontFamily: 'Montserrat'
      },
      handleScale: {
        axisPressedMouseMove: {
          price: false,
          time: false
        },
        pinch: false,
        mouseWheel: false
      },
      timeScale: {
        lockVisibleTimeRangeOnResize: true,
        tickMarkFormatter: (time) => {
          return DateTime.now().set(time).toFormat('yyyy/MM/dd')
        },
        minBarSpacing: 6,
        barSpacing: 6
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

        const uniqueGroups = Object.keys(groupedValues).filter(
          (key) => !this.data[index]?.some((entry) => entry.time === key)
        )

        const data: GraphEntry[] = sortBy(uniqueGroups, (key) =>
          DateTime.fromISO(key)
        ).map((groupKey) => {
          const group = groupedValues[groupKey]
          const filteredGroup = group.filter(
            (entry) => entry.point.id !== 'empty-group'
          )

          const hadEntries = filteredGroup.length > 0

          this.hasEntries = this.hasEntries || hadEntries

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
        this.lineSeries[index].setMarkers(
          this.data[index].map((entry) => ({
            time: entry.time,
            shape: 'circle',
            position: 'inBar',
            color: api.baseData.colors.primary
          }))
        )
      })

      if (
        !measurements.data.length &&
        !this.hasEntries &&
        ++this.emptyPeriodCount >= this.EMPTY_PERIOD_TOLERANCE
      ) {
        this.showEmptyDataError()
      } else {
        this.hideEmptyDataError()
      }

      this.setDateRangeButtonState(true)
      this.scaleChart$.next()

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
      this.chart.applyOptions({ priceScale: { autoScale: false } })
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

  private hideEmptyDataError(): void {
    document.querySelector('#empty-data-error').classList.add('hidden')
    document
      .querySelector('#lightweight-chart-container')
      .classList.remove('hidden')
    document.querySelector('#graph-header-container').classList.remove('hidden')
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
            this.emptyPeriodCount = 0
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
        .subscribe(this.onVisibleLogicalRangeChanged),
      merge(this.scaleChart$, this.visibleLocalRangeChanged$)
        .pipe(
          filter(() => !this.isLoading && !this.rangeChangeBumper),
          debounceTime(1500)
        )
        .subscribe(this.scaleChart)
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

      const lastDate = api.baseData.lastDate
        ? DateTime.fromISO(api.baseData.lastDate)
        : DateTime.now()

      if (this.hasSameDateEntry(pivotDate) || startDate > lastDate) {
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
    this.chart.resize(
      document.documentElement.clientWidth,
      document.documentElement.clientHeight - this.chartHeightOffset
    )
  }

  private async scaleChart(): Promise<void> {
    if (!this.chart) {
      return
    }
    this.chart.applyOptions({ priceScale: { autoScale: true } })
    await new Promise((resolve) => setTimeout(resolve, 500))
    this.chart.applyOptions({ priceScale: { autoScale: false } })
  }

  private setDateRangeButtonState(enabled: boolean): void {
    if (enabled) {
      this.dateRangeButton.classList.remove('disabled')
    } else {
      this.dateRangeButton.classList.add('disabled')
    }
  }

  private showEmptyDataError(): void {
    document.querySelector('#empty-data-error').classList.remove('hidden')
    document
      .querySelector('#lightweight-chart-container')
      .classList.add('hidden')
    document.querySelector('#graph-header-container').classList.add('hidden')
  }
}

customElements.define('dashboard-graph', GraphElement)
