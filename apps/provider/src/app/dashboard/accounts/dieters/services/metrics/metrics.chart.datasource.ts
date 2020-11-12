import { CCRConfig, CCRPalette } from '@app/config'
import { ContextService } from '@app/service'
import { ChartData, ChartDataSource } from '@app/shared'
import { _ } from '@app/shared/utils'
import { paletteSelector } from '@app/store/config'
import { select, Store } from '@ngrx/store'
import { TranslateService } from '@ngx-translate/core'
import { groupBy } from 'lodash'
import * as moment from 'moment'
import { untilDestroyed } from 'ngx-take-until-destroy'
import { from, Observable, Subject } from 'rxjs'
import { MeasurementTimeframe } from '../measurement/measurement.criteria'
import { MetricsDatabase } from './metrics.database'
import {
  MetricsDataSourceCriteria,
  MetricsDataSourceResponse,
  MetricsRow
} from './metrics.datasource'

interface MetricsChartDataSourceCriteria extends MetricsDataSourceCriteria {
  metric: string
  timeframe: MeasurementTimeframe
}

export class MetricsChartDataSource extends ChartDataSource<
  any,
  MetricsChartDataSourceCriteria
> {
  public max: number
  public metric: string
  public min: number
  public palette: CCRPalette
  public result$: Subject<any> = new Subject<any>()

  private exerciseTypes = {
    aerobic: {
      displayName: _('GLOBAL.AEROBIC'),
      name: 'Aerobic',
      unit: _('GLOBAL.MINUTES')
    },
    strength: {
      displayName: _('GLOBAL.STRENGTH'),
      name: 'Strength',
      unit: _('GLOBAL.MINUTES')
    }
  }

  constructor(
    protected database: MetricsDatabase,
    private context: ContextService,
    private translator: TranslateService,
    private store: Store<CCRConfig>
  ) {
    super()

    this.store.pipe(select(paletteSelector)).subscribe((palette) => {
      this.palette = palette
    })

    // factors with translatable units
    this.buildFormatter()
    this.translator.onLangChange
      .pipe(untilDestroyed(this, 'disconnect'))
      .subscribe(() => {
        this.buildFormatter()
      })
  }

  public defaultFetch(): MetricsDataSourceResponse {
    return {
      keys: { data: [], pagination: {} },
      exercise: { data: [], pagination: {} }
    }
  }

  public fetch(criteria: any): Observable<MetricsDataSourceResponse> {
    return from(this.database.fetch(criteria))
  }

  public mapChart(result: Array<any>): ChartData {
    if (!result || !result.length) {
      return this.defaultChart()
    }

    const linePoints =
      this.args.timeframe === 'year' || this.args.timeframe === 'alltime'
        ? {
            borderColor: this.palette.accent,
            pointBackgroundColor: this.palette.primary,
            pointRadius: 0,
            pointHoverRadius: 5
          }
        : {
            borderColor: this.palette.accent,
            pointBackgroundColor: this.palette.primary
          }

    const headings = []
    const chart = {
      type: 'line',
      datasets: [{ data: [], lineTension: 0 }],
      labels: [],
      legend: true,
      options: {
        tooltips: {
          type: 'index',
          callbacks: {
            title: (tooltipItem, d) => {
              // For now, all charts use the same X 'heading'
              // const i = tooltipItem[0].datasetIndex;
              const j = tooltipItem[0].index // - 1: spacer
              return headings[0][j] ? headings[0][j] : ''
            },
            label: (tooltipItem, d) => {
              const m = this.metric
              // TODO add distance marker if it's estimated
              return (
                tooltipItem.yLabel +
                ' ' +
                this.formatters[m][0](tooltipItem.yLabel)
              )
            }
          }
        }
      },
      colors: [linePoints]
    }

    // formats
    let xlabelFormat
    let tooltipFormat
    let xMaxTicks
    switch (this.args.timeframe) {
      case 'week':
        xMaxTicks = 11
        xlabelFormat = 'ddd D'
        tooltipFormat = 'ddd, MMM D'
        break
      case 'month':
        xMaxTicks = 31
        xlabelFormat = 'MMM D'
        tooltipFormat = 'MMM D'
        break
      case 'year':
        xMaxTicks = 12
        xlabelFormat = 'MMM YYYY'
        tooltipFormat = 'MMM YYYY'
        break
      case 'alltime':
        xMaxTicks = 18
        xlabelFormat = 'MMM DD, YYYY'
        tooltipFormat = 'MMM DD, YYYY'
        break
      default:
        xMaxTicks = 11
        xlabelFormat = 'MMM YYYY'
        tooltipFormat = 'MMM DD, YYYY'
    }
    tooltipFormat = 'ddd, MMM D' // tmp

    result = result.filter((s) => Number(s[this.metric]))

    if (!result.length) {
      return chart
    }

    // labels
    chart.labels = [
      '',
      ...this.generatePlaceholderLabels(result, xlabelFormat),
      ''
    ]

    // data points and headings
    delete this.min
    delete this.max

    chart.datasets.length = 0

    const offsetData = this.generateOffsetData(
      result,
      xlabelFormat,
      this.metric
    )

    if (Array.isArray(offsetData[0])) {
      offsetData[0].forEach((dataset, index) => {
        const cleanData = offsetData.map((oD) => oD[index])
        // fill the dataset
        chart.datasets.push({
          data: cleanData,
          lineTension: 0,
          fill: false
        } as any)
      })
    } else {
      // fill the dataset
      chart.datasets.push({
        data: offsetData,
        lineTension: 0
      })
    }

    // fill the headings
    headings.push(result.map((s) => moment(s.date).format(tooltipFormat)))

    if (this.min && this.max) {
      // round to multiples of 10 for > 100
      this.min = this.min > 100 ? Math.round(this.min / 10) * 10 : this.min
      this.max = this.max > 100 ? Math.round(this.max / 10) * 10 : this.max

      chart.options['scales'] = {
        yAxes: [
          {
            ticks: {
              beginAtZero: false,
              min: Math.max(0, Math.round(this.min - this.min * 0.1)),
              max: Math.round(this.max * 1.1),
              callback: function (value, index, values) {
                return !index || index === values.length - 1
                  ? ''
                  : value.toFixed(1)
              }
            }
          }
        ],
        xAxes: [
          {
            ticks: {
              maxTicksLimit: xMaxTicks
            }
          }
        ]
      }
    }

    return chart
  }

  public mapResult(result: MetricsDataSourceResponse): MetricsRow[] {
    const emptyDays = this.calculateEmptyDays()

    const groupedExerciseEntries = groupBy(result.exercise.data, (exEntry) =>
      moment(exEntry.activitySpan.start).format('YYYY-MM-DD')
    )

    const groupedFoodKeyEntries = groupBy(result.keys.data, (fkEntry) =>
      moment(fkEntry.consumedAt).format('YYYY-MM-DD')
    )

    const metricsRows: MetricsRow[] = emptyDays.map((emptyDay) => {
      const formattedDate = moment(emptyDay.date).format('YYYY-MM-DD')
      const exerciseEntryGroup = groupedExerciseEntries[formattedDate] || []

      const foodKeyEntryGroup = groupedFoodKeyEntries[formattedDate] || []

      return {
        date: emptyDay.date,
        value: 0,
        name: '',
        unit: '',
        aerobic: this.calculateExerciseAmount(
          exerciseEntryGroup,
          this.exerciseTypes.aerobic.name
        ),
        strength: this.calculateExerciseAmount(
          exerciseEntryGroup,
          this.exerciseTypes.strength.name
        ),
        foodKey: foodKeyEntryGroup.reduce(
          (sum, fkEntry) => sum + fkEntry.quantity,
          0
        )
      }
    })

    return metricsRows
  }

  public postResult(result: MetricsRow[]): MetricsRow[] {
    this.result$.next(result)
    return result
  }

  private calculateEmptyDays(): MetricsRow[] {
    let endDate = moment(this.args.endDate)
    const emptyDays = []
    const emptyMeasurement: MetricsRow = {
      date: '',
      aerobic: 0,
      strength: 0,
      foodKey: 0,
      unit: ''
    }

    if (endDate.isAfter(moment(), 'day')) {
      endDate = endDate.add(1, 'day')
    }

    for (
      let currentDate = moment(this.args.startDate).startOf('day');
      currentDate <= endDate;
      currentDate = currentDate.add(1, 'day')
    ) {
      const currentFormattedDate = currentDate.toISOString()
      const emptyMeasurementItem = { ...emptyMeasurement }
      emptyMeasurementItem.date = currentFormattedDate
      emptyDays.push(emptyMeasurementItem)
    }

    return emptyDays
  }

  private buildFormatter() {
    this.translator
      .get([_('GLOBAL.FOOD_KEYS'), _('GLOBAL.MINUTES')])
      .subscribe((texts) => {
        // utilities
        const genLabel = (metric: string) => {
          return () => {
            return texts[metric] || metric
          }
        }
        // setup the label formatters
        this.formatters = {
          foodKey: [genLabel(_('GLOBAL.FOOD_KEYS')), (v) => v, true],
          aerobic: [genLabel(_('GLOBAL.MINUTES')), (v) => v, true],
          strength: [genLabel(_('GLOBAL.MINUTES')), (v) => v, true]
        }
      })
  }

  private calculateExerciseAmount(
    exerciseEntries,
    exerciseName: string
  ): number {
    const targetExercises = exerciseEntries.filter(
      (exerciseEntry) => exerciseEntry.exerciseType.name === exerciseName
    )

    return targetExercises.reduce((sum, entry) => {
      const startDate = moment(entry.activitySpan.start)
      return (
        sum +
        Math.abs(startDate.diff(moment(entry.activitySpan.end), 'minutes'))
      )
    }, 0)
  }

  private generateOffsetData(
    results: any[],
    labelFormat: string,
    field: string
  ) {
    // const cleanField = this.getField(field);
    const resultArray = []
    results = [...results]

    results.forEach((result) => {
      const value = this.formatters[this.metric]
        ? this.formatters[this.metric][1](result[field])
        : result[field].toFixed(1)
      this.min =
        this.min === undefined || value < this.min
          ? Math.floor(value)
          : this.min
      this.max = !this.max || value > this.max ? Math.ceil(value) : this.max
      resultArray.push({
        x: moment(result.date).format(labelFormat),
        y: value
      })
    })

    return resultArray
  }

  private generatePlaceholderLabels(
    results: MetricsRow[],
    labelFormat: string
  ): string[] {
    const labels = []
    const startDate = moment(this.criteria.startDate)
    const endDate = moment(this.criteria.endDate)
    const currentDate =
      this.criteria.timeframe === 'alltime'
        ? moment(results[0].date).startOf('day')
        : startDate
    while (currentDate.isSameOrBefore(endDate)) {
      const formattedDate = currentDate.format(labelFormat)
      labels.push(formattedDate)
      currentDate.add(1, 'day')
    }

    return labels
  }
}
