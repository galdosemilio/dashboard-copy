import { baseData, CcrElement, DateRange } from '../../model'
import { createChart } from 'lightweight-charts'
import { eventService } from '@chart/service'
import { api } from '@chart/service/api'
import { DateTime } from 'luxon'
import {
  convertToReadableFormat,
  MeasurementDataPointAggregate
} from '@coachcare/sdk'
import { groupBy } from 'lodash'
import { Subject } from 'rxjs'
import { debounceTime, filter } from 'rxjs/operators'

import './graph.element.scss'

export class GraphElement extends CcrElement {
  private chart
  private chartHeight = 400
  private dateRange: DateRange
  private lineSeries
  private resizeChart$: Subject<void> = new Subject<void>()
  private chartTimeFormat = 'yyyy-MM-dd'

  constructor() {
    super()
    this.resizeChart = this.resizeChart.bind(this)
    this.onSwipeLeft = this.onSwipeLeft.bind(this)
    this.onSwipeRight = this.onSwipeRight.bind(this)
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
        type: 'volume',
        precision: 1,
        minMove: 0.5
      },
      priceLineVisible: false,
      lastValueVisible: false,
      priceLineColor: baseData.colors.primary,
      color: baseData.colors.primary,
      lineWidth: 2
    })
  }

  private createChart(): void {
    const chartContainer = document.getElementById(
      'lightweight-chart-container'
    )
    this.chart = createChart(chartContainer, {
      handleScroll: false,
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

    chartContainer.addEventListener('swiped-left', this.onSwipeLeft)
    chartContainer.addEventListener('swiped-right', this.onSwipeRight)
  }

  private async fetchMeasurements(): Promise<void> {
    try {
      if (!this.dateRange) {
        return
      }

      const measurements = await api.measurementDataPoint.getAggregates({
        account: api.baseData.accountId,
        type: [api.baseData.dataPointTypeId],
        recordedAt: this.dateRange,
        limit: 'all',
        unit: 'day'
      })

      const emptyGroups = this.createEmptyDateGroups()

      const groupedValues = groupBy(
        [...emptyGroups, ...measurements.data],
        (group) => group.bucket.date
      )

      const data = Object.values(groupedValues)
        .map((group) => {
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
        .filter((entry) => !!entry)

      this.lineSeries.setData([...data])

      this.chart.timeScale().setVisibleRange({
        from: DateTime.fromISO(this.dateRange.start).toFormat(
          this.chartTimeFormat
        ),
        to: DateTime.fromISO(this.dateRange.end).toFormat(this.chartTimeFormat)
      })
      this.chart.timeScale().fitContent()
    } catch (error) {
      console.error(error)
    }
  }

  private createEmptyDateGroups(): MeasurementDataPointAggregate[] {
    const emptyGroups: MeasurementDataPointAggregate[] = []
    const startDate = DateTime.fromISO(this.dateRange.start)
    const endDate = DateTime.fromISO(this.dateRange.end)

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

  private listenToEvents(): void {
    this.subscriptions.push(
      eventService
        .listen<DateRange>('graph.date-range')
        .subscribe((dateRange) => {
          this.dateRange = dateRange
          this.fetchMeasurements()
        }),
      eventService.baseDataEvent$.subscribe(() => this.fetchMeasurements()),
      this.resizeChart$
        .pipe(
          debounceTime(1000),
          filter(() => !!this.chart)
        )
        .subscribe(this.resizeChart)
    )
  }

  private listenToResizeEvent(): void {
    window.addEventListener('resize', () => this.resizeChart$.next())
  }

  private onSwipeLeft(): void {
    eventService.trigger('graph.date-range-next')
  }

  private onSwipeRight(): void {
    eventService.trigger('graph.date-range-previous')
  }

  private resizeChart(): void {
    this.chart.resize(document.documentElement.clientWidth, this.chartHeight)
  }
}

customElements.define('dashboard-graph', GraphElement)
