import './graph.element.scss'

import * as utils from '@chart/utils'
import { CcrElement, DateRange, Timeframe, baseData } from '../../model'
import {
  MeasurementDataPointAggregate,
  convertToReadableFormat,
  MeasurementDataPointType,
  DataPointTypes
} from '@coachcare/sdk'
import { auditTime, debounceTime, filter } from 'rxjs/operators'

import { DateTime } from 'luxon'
import { merge, Subject } from 'rxjs'
import { api } from '@chart/service/api'
import { createChart } from 'lightweight-charts'
import { eventService } from '@chart/service'
import { chain, groupBy, maxBy, sortBy } from 'lodash'
import { translate } from '@chart/service/i18n'

export interface GraphEntry {
  value: number
  time: string
  weightValue?: number
}

export class GraphElement extends CcrElement {
  private chart
  private chartHeightOffset = 225
  private chartTimeFormat = 'yyyy-MM-dd'
  private sourceId = '-1'
  private measurementData: MeasurementDataPointAggregate[] = []
  private data: GraphEntry[][] = []
  private dateRange: DateRange
  private dateRangeButton: HTMLButtonElement
  private readonly EMPTY_PERIOD_TOLERANCE = 2
  private emptyPeriodCount = 0
  private hasEntries: boolean
  private isLoading: boolean
  private isReady = false
  private firstTime = true
  private lineSeries = []
  private listViewReportedEmpty = false
  private rangeChangeBumper = false
  private resizeChart$: Subject<void> = new Subject<void>()
  private timeframe: Timeframe
  private visibleLocalRangeChanged$: Subject<Record<string, unknown>> =
    new Subject<Record<string, unknown>>()
  private scaleChart$: Subject<void> = new Subject<void>()
  private dataPointTypes: MeasurementDataPointType[]

  constructor() {
    super()
    this.resizeChart = this.resizeChart.bind(this)
    this.onVisibleLogicalRangeChanged =
      this.onVisibleLogicalRangeChanged.bind(this)
    this.scaleChart = this.scaleChart.bind(this)
  }

  onInit(): void {
    this.listenToEvents()
    this.listenToResizeEvent()
  }

  afterViewInit(): void {
    this.createChart()

    eventService.baseDataEvent$.subscribe((baseData) => {
      if (!baseData.dataPointTypeId) {
        return
      }

      this.sourceId = baseData.sourceId || '-1'
      this.isReady = true

      if (baseData.isWeightRequired) {
        this.dataPointTypes = baseData.dataPointTypes.filter(
          (d) => d.id !== DataPointTypes.WEIGHT
        )
      } else {
        this.dataPointTypes = baseData.dataPointTypes
      }

      this.addLineSeries()
    })

    eventService.listen<string>('graph.source-change').subscribe((source) => {
      this.sourceId = source

      this.onChangedSource()
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
        <dashboard-source-selector></dashboard-source-selector>
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
    this.dataPointTypes.forEach((type, index) => {
      const unit = utils.unit(type, api.baseData.metric)
      const color = Object.keys(api.baseData.colors)[index]

      const series = this.chart.addLineSeries({
        priceFormat: {
          type: 'custom',
          precision: 1,
          minMove:
            api.baseData.dataPointTypeId === DataPointTypes.SLEEP ? 60 : 0.5,
          formatter: (value) =>
            utils.format(value, api.baseData.dataPointTypeId) + ' ' + unit
        },
        priceLineVisible: false,
        lastValueVisible: false,
        priceLineColor: api.baseData.colors[color],
        color: api.baseData.colors[color],
        lineWidth: 2,
        autoscaleInfoProvider: (original) => {
          const res = original()

          if (res && res.priceRange !== null) {
            res.priceRange.minValue = Math.max(res.priceRange.minValue, 0)
          }

          return res
        }
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
      handleScroll: {
        vertTouchDrag: false,
        pressedMouseMove: false,
        mouseWheel: false,
        horzTouchDrag: true
      },
      timeScale: {
        lockVisibleTimeRangeOnResize: true,
        tickMarkFormatter: (time) => {
          return DateTime.now().set(time).toFormat('yyyy/MM/dd')
        }
      }
    })

    this.chart.applyOptions({
      priceScale: {
        scaleMargins: {
          bottom: 0,
          top: 0.1
        }
      }
    })

    this.chart
      .timeScale()
      .subscribeVisibleLogicalRangeChange((newVisibleLogicalRange) =>
        this.visibleLocalRangeChanged$.next(newVisibleLogicalRange)
      )
  }

  private onChangedSource(): void {
    const filteredData = this.measurementData.filter(
      (entry) => entry.point.group.source.id === this.sourceId
    )
    const measurementData = filteredData.length
      ? filteredData
      : this.measurementData

    const measurementMaps = this.dataPointTypes.map((type) =>
      measurementData.filter((entry) => entry.point.type.id === type.id)
    )

    measurementMaps.forEach((values, index) => {
      const groupedValues = groupBy(values, (group) =>
        DateTime.fromISO(group.bucket.timestamp).toFormat(this.chartTimeFormat)
      )

      for (const entry of this.data[index]) {
        if (groupedValues[entry.time]) {
          const newEntry = maxBy(
            groupedValues[entry.time],
            (grp) => grp.point.value
          )

          entry.value = convertToReadableFormat(
            newEntry.point.value,
            newEntry.point.type,
            baseData.metric
          )
        } else {
          entry.value = undefined
        }
      }
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

    this.chart.timeScale().setVisibleRange({
      from: DateTime.fromISO(this.dateRange.start).toFormat(
        this.chartTimeFormat
      ),
      to: DateTime.fromISO(this.dateRange.end).toFormat(this.chartTimeFormat)
    })

    this.chart.applyOptions({
      priceScale: { autoScale: false },
      timeScale: { rightOffset: this.getTimeframeChartOffset(this.timeframe) }
    })
    eventService.trigger(
      'graph.data',
      this.getEntriesBetweenRange(this.dateRange)
    )
  }

  private async fetchMeasurements(append = true): Promise<void> {
    try {
      if (!this.isReady || !this.dateRange || this.isLoading) {
        return
      }

      this.isLoading = true

      const results = await api.measurementDataPoint.getAggregates({
        account: api.baseData.accountId || undefined,
        type: api.baseData.dataPointTypes.map((t) => t.id),
        recordedAt: this.dateRange,
        'include-in-partition': 'source',
        limit: 'all',
        unit: 'day'
      })

      let measurements = results.data
      let weightMeasurements: MeasurementDataPointAggregate[] = []

      if (api.baseData.isWeightRequired) {
        weightMeasurements = measurements.filter(
          (m) => m.point.type.id === DataPointTypes.WEIGHT
        )
        const otherMeasurements = measurements.filter(
          (m) => m.point.type.id !== DataPointTypes.WEIGHT
        )

        measurements = otherMeasurements
      }

      this.measurementData = append
        ? this.measurementData.concat(measurements)
        : measurements.concat(this.measurementData)

      const sources = chain(this.measurementData)
        .map((entry) => entry.point.group.source)
        .uniqBy((src) => src.id)
        .sortBy((src) => src.id)
        .value()

      if (sources.length > 1) {
        eventService.trigger('graph.sources', sources)

        const chartHeightOffset = 275

        if (chartHeightOffset !== this.chartHeightOffset) {
          this.chartHeightOffset = chartHeightOffset
          this.resizeChart$.next()
        }
      }

      const filteredData = measurements.filter(
        (entry) => entry.point.group.source.id === this.sourceId
      )

      const measurementData = filteredData.length ? filteredData : measurements

      const measurementMaps = this.dataPointTypes.map((type) =>
        measurementData.filter((entry) => entry.point.type.id === type.id)
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
          const emptyGroup = group.find(
            (entry) => entry.point.id === 'empty-group'
          )

          const hadEntries = filteredGroup.length > 0

          this.hasEntries = this.hasEntries || hadEntries

          const entry = hadEntries
            ? maxBy(filteredGroup, (grp) => grp.point.value)
            : emptyGroup

          const weightEntry =
            entry &&
            weightMeasurements.find(
              (w) =>
                w.bucket.date === entry.bucket.date &&
                w.point.group.source.id === entry.point?.group?.source.id
            )
          return {
            time: DateTime.fromISO(entry.bucket.timestamp).toFormat(
              this.chartTimeFormat
            ),
            value: hadEntries
              ? convertToReadableFormat(
                  entry.point.value,
                  entry.point.type,
                  baseData.metric
                )
              : undefined,
            weightValue: weightEntry
              ? convertToReadableFormat(
                  weightEntry.point.value,
                  weightEntry.point.type,
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
        (!measurementData.length &&
          !this.hasEntries &&
          ++this.emptyPeriodCount >= this.EMPTY_PERIOD_TOLERANCE) ||
        this.listViewReportedEmpty
      ) {
        this.showEmptyDataError()
      } else {
        this.hideEmptyDataError()
      }

      this.setDateRangeButtonState(true)

      if (!this.firstTime) {
        this.scaleChart$.next()
        return
      }

      this.chart.timeScale().setVisibleRange({
        from: DateTime.fromISO(this.dateRange.start).toFormat(
          this.chartTimeFormat
        ),
        to: DateTime.fromISO(this.dateRange.end).toFormat(this.chartTimeFormat)
      })

      this.chart.applyOptions({
        priceScale: { autoScale: false },
        timeScale: { rightOffset: this.getTimeframeChartOffset(this.timeframe) }
      })
      eventService.trigger(
        'graph.data',
        this.getEntriesBetweenRange(this.dateRange)
      )
      this.firstTime = false
      this.rangeChangeBumper = true
      void this.scaleChart()

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
        },
        count: 0
      })

      currentDate = currentDate.plus({ day: 1 })
    }

    return emptyGroups
  }

  private getBarSpacingSettings(timeframe: Timeframe): {
    barSpacing: number
    minBarSpacing: number
  } {
    switch (timeframe) {
      case 'week':
        return { minBarSpacing: 33, barSpacing: 33 }
      case 'month':
        return { minBarSpacing: 8, barSpacing: 8 }
      case 'year':
        return { minBarSpacing: 0.05, barSpacing: 0.8 }
    }
  }

  private getTimeframeChartOffset(timeframe: Timeframe): number {
    switch (timeframe) {
      case 'week':
        return 1
      case 'month':
        return 5
      case 'year':
        return 37
    }
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
            void this.fetchMeasurements()
          }
        }),
      eventService
        .listen<Timeframe>('graph.timeframe')
        .subscribe((timeframe) => (this.timeframe = timeframe)),
      eventService
        .listen<boolean>('list.no-previous-entries')
        .subscribe((isEmpty) => {
          this.listViewReportedEmpty = isEmpty

          if (!this.listViewReportedEmpty) {
            return
          }

          this.showEmptyDataError()
        }),
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
          debounceTime(600)
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
        ? DateTime.fromFormat(api.baseData.lastDate, 'yyyy-MM-dd')
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
    this.chart.applyOptions({
      timeScale: this.getBarSpacingSettings(this.timeframe)
    })

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
