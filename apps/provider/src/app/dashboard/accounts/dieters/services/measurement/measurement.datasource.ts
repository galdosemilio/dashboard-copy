import { CCRConfig, CCRPalette } from '@app/config'
import {
  ContextService,
  NotifierService,
  MeasurementCriteria,
  MeasurementSummaryData,
  MeasurementSummarySegment
} from '@app/service'
import {
  _,
  APISummaryResponse,
  ChartData,
  ChartDataSource,
  KILOMETER,
  Metric,
  unitConversion,
  unitLabel
} from '@app/shared'
import { paletteSelector } from '@app/store/config'
import { select, Store } from '@ngrx/store'
import { TranslateService } from '@ngx-translate/core'
import { isArray, merge } from 'lodash'
import * as moment from 'moment-timezone'
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy'
import { from, Observable, Subject } from 'rxjs'
import { BodyMeasurement } from '../../models/measurement/bodyMeasurement'
import { MeasurementDatabase } from './measurement.database'

@UntilDestroy()
export class MeasurementDataSource extends ChartDataSource<
  any,
  MeasurementCriteria
> {
  hasTooMuchForSingleDay = false
  hasMissingWeight = false
  measurement: MeasurementSummaryData
  missingWeightDates: string[] = []
  palette: CCRPalette

  distanceNote: Array<boolean> = []
  result$: Subject<any> = new Subject<any>()

  private min: number
  private max: number

  constructor(
    protected notify: NotifierService,
    protected database: MeasurementDatabase,
    private translator: TranslateService,
    private context: ContextService,
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

  disconnect() {}

  private buildFormatter() {
    this.translator
      .get([
        _('UNIT.CM'),
        _('UNIT.G'),
        _('UNIT.IN'),
        _('UNIT.KG'),
        _('UNIT.LB'),
        _('UNIT.LBS'),
        _('UNIT.STEPS'),
        _('UNIT.HOURS'),
        _('UNIT.INCHES'),
        _('UNIT.KM'),
        _('UNIT.MI'),
        _('UNIT.GRAMS'),
        _('UNIT.MICROUNIT'),
        _('UNIT.MGR'),
        _('UNIT.MLT'),
        _('UNIT.LT'),
        _('UNIT.DLT'),
        _('UNIT.CELSIUS'),
        _('UNIT.BEATS_PER_MIN'),
        _('UNIT.BREATHS_PER_MIN')
      ])
      .subscribe((texts) => {
        const units = this.context.user.measurementPreference
        // utilities
        const genLabel = (metric: Metric) => {
          return (val: number) => {
            const label = unitLabel(units, metric, val)
            return texts[label] || label
          }
        }
        // setup the label formatters
        this.formatters = {
          weight: [genLabel('composition'), (v) => v.toFixed(1), true],
          bmi: [() => '', (v) => v.toFixed(1), true],
          bloodPressureDiastolic: [() => 'mmHg', (v) => v.toFixed(1), true],
          bloodPressureSystolic: [() => 'mmHg', (v) => v.toFixed(1), true],
          bloodOxygenLevel: [() => '', (v) => v.toFixed(0), true],
          bodyFat: [genLabel('composition'), (v) => v.toFixed(1), true],
          leanMass: [genLabel('composition'), (v) => v.toFixed(1), true],
          visceralFatPercentage: [() => '%', (v) => v.toFixed(1), false],
          visceralFatTanita: [() => '', (v) => v.toFixed(), true],
          waterPercentage: [() => '%', (v) => v.toFixed(1), false],
          steps: [() => texts['UNIT.STEPS'], Number, true],
          average: [() => '', (v) => v, true],
          distance: [genLabel('distance'), (v) => v.toFixed(1), true],
          total: [() => texts['UNIT.HOURS'], (v) => v.toFixed(1), true],
          sleepQuality: [() => '%', (v) => v, true],
          waist: [genLabel('circumference'), (v) => v.toFixed(1), true],
          arm: [genLabel('circumference'), (v) => v.toFixed(1), true],
          chest: [genLabel('circumference'), (v) => v.toFixed(1), true],
          hip: [genLabel('circumference'), (v) => v.toFixed(1), true],
          thigh: [genLabel('circumference'), (v) => v.toFixed(1), true],
          calories: [() => '', (v) => v, true],
          protein: [() => texts['UNIT.GRAMS'], (v) => v.toFixed(1), true],
          carbohydrates: [() => texts['UNIT.GRAMS'], (v) => v.toFixed(1), true],
          totalFat: [() => texts['UNIT.GRAMS'], (v) => v.toFixed(1), true],
          totalCholesterol: [
            () => `${texts['UNIT.MLT']}/${texts['UNIT.DLT']}`,
            (v) => v,
            true
          ],
          ldl: [
            () => `${texts['UNIT.MLT']}/${texts['UNIT.DLT']}`,
            (v) => v,
            true
          ],
          hdl: [
            () => `${texts['UNIT.MLT']}/${texts['UNIT.DLT']}`,
            (v) => v,
            true
          ],
          vldl: [
            () => `${texts['UNIT.MLT']}/${texts['UNIT.DLT']}`,
            (v) => v,
            true
          ],
          triglycerides: [
            () => `${texts['UNIT.MLT']}/${texts['UNIT.DLT']}`,
            (v) => v,
            true
          ],
          fastingGlucose: [
            () => `${texts['UNIT.MGR']}/${texts['UNIT.DLT']}`,
            (v) => v,
            true
          ],
          hba1c: [() => '%', (v) => v, true],
          insulin: [
            () => `${texts['UNIT.MICROUNIT']}/${texts['UNIT.MLT']}`,
            (v) => v,
            true
          ],
          hsCrp: [
            () => `${texts['UNIT.MGR']}/${texts['UNIT.LT']}`,
            (v) => v,
            true
          ],
          temperature: [
            () => (units === 'us' ? '&#8457;' : texts['UNIT.CELSIUS']),
            (v) => parseFloat(v.toString()).toFixed(2),
            true
          ],
          heartRate: [() => texts['UNIT.BEATS_PER_MIN'], (v) => v, true],
          respirationRate: [
            () => texts['UNIT.BREATHS_PER_MIN'],
            (v) => v,
            true
          ],
          extracellularWaterToBodyWater: [() => `%`, (v) => v.toFixed(1), true],
          totalBodyWater: [() => texts['UNIT.MLT'], (v) => v.toFixed(1), true],
          visceralAdiposeTissue: [
            () => texts['UNIT.LT'],
            (v) => v.toFixed(),
            true
          ],
          visceralFatMass: [() => texts['UNIT.G'], (v) => v.toFixed(1), true]
        }
      })
  }

  defaultFetch(): any {
    return [{ data: [] }]
  }

  fetch(criteria): Observable<Array<APISummaryResponse>> {
    return from(
      new Promise<APISummaryResponse[]>(async (resolve, reject) => {
        try {
          const response = await this.database.fetchAllSummary({
            ...criteria,
            startDate: moment(criteria.startDate)
              .startOf('day')
              .format('YYYY-MM-DD'),
            endDate: moment(criteria.endDate).endOf('day').format('YYYY-MM-DD')
          })

          const mergedData = []

          response.forEach((element) => {
            const array = element.data || element
            array.forEach((data, index) => {
              data.date = moment(data.date, 'YYYY-MM-DD').toISOString()
              mergedData[index] = { ...data, ...mergedData[index] }
            })
          })

          const parsedResponse = response.map((element) => {
            if (element.data) {
              element.data = mergedData
            } else {
              element = mergedData
            }

            return element
          })

          const cleanResponse = parsedResponse.map((summary) =>
            summary.data
              ? {
                  summary: summary.summary,
                  data: summary.data.map(
                    (element) =>
                      new BodyMeasurement(element, {
                        measurementPreference:
                          this.context.user.measurementPreference,
                        timeframe: this.criteria.timeframe
                      })
                  )
                }
              : summary.map(
                  (element) =>
                    new BodyMeasurement(element, {
                      measurementPreference:
                        this.context.user.measurementPreference,
                      timeframe: this.criteria.timeframe
                    })
                )
          )

          return resolve(cleanResponse)
        } catch (error) {
          reject(error)
        }
      })
    )
  }

  mapResult(result) {
    if (isArray(result[0])) {
      // Food Summary
      result[0] = {
        data: result[0]
      }
    }

    const res: APISummaryResponse = merge({}, ...result)
    this.summary$.next(res.summary ? res.summary : {})
    return res.data ? res.data : []
  }

  postResult(result: Array<any>) {
    if (this.criteria.useNewEndpoint) {
      this.result$.next(result)
      return result
    }

    // MeasurementSummarySegment
    this.distanceNote = []
    // unit conversion according to the user
    const units = this.context.user.measurementPreference
    result.forEach((row, i) => {
      row.id = i.toString()
      this.distanceNote[i] = false
      // distance post processing
      if (row.hasOwnProperty('distanceTotal')) {
        if (row.stepTotal) {
          this.distanceNote[i] = true
        }
        row.distanceTotal = Number(
          row.stepTotal
            ? (row.stepTotal / KILOMETER) * 1000
            : row.distanceTotal || 0
        )

        row.stepEntries = row.stepEntries.map((entry) => ({
          ...entry,
          distance: unitConversion(
            units,
            'distance',
            Number((entry.steps / KILOMETER) * 1000),
            false
          )
        }))
      }
      row.stepTotal = Number(row.stepTotal || 0)
      row.distanceTotal = unitConversion(
        units,
        'distance',
        Number(row.distanceTotal || 0),
        false
      )
      row.sleepMinutes = Number(row.sleepMinutes ? row.sleepMinutes / 3600 : 0)
      row.sleepQuality = Number(row.sleepQuality || 0)
      row.caloriesTotal = row.caloriesTotal || 0
      // TODO FoodSummary response typing changed
      row.calories = row.calories || 0
      row.protein = row.protein || 0
      row.carbohydrates = row.carbohydrates || 0
      row.totalFat = row.totalFat || 0
    })
    this.result$.next(result)
    return result
  }

  mapChart(result: Array<MeasurementSummarySegment>): ChartData {
    this.hasMissingWeight = false

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
              const m = this.args.data[0]
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
      case 'day':
        xMaxTicks = 26
        xlabelFormat = 'h:mm a'
        tooltipFormat = 'ddd D h:mm a'
        break
      case 'week':
        xMaxTicks = 11
        xlabelFormat = 'ddd D'
        tooltipFormat = 'ddd, MMM D h:mm a'
        break
      case 'month':
        xMaxTicks = 31
        xlabelFormat = 'MMM D'
        tooltipFormat = 'MMM D h:mm a'
        break
      case 'threeMonths':
        xMaxTicks = 12
        xlabelFormat = 'MMM DD, YYYY'
        tooltipFormat = 'MMM DD, YYYY h:mm a'
        break
      case 'sixMonths':
        xMaxTicks = 12
        xlabelFormat = 'MMM DD, YYYY'
        tooltipFormat = 'MMM DD, YYYY h:mm a'
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
      default:
        xMaxTicks = 11
        xlabelFormat = 'MMM YYYY'
        tooltipFormat = 'MMM DD, YYYY'
    }

    // FIXME if we're charting multiple fields, multiple axis needs to be handled

    // filter empty values if the formatted is configured to do so
    // and we're charting only one field, to keep data integrity
    if (this.args.data.length > 1) {
      this.args.data = [this.args.data[0]]
    }
    if (this.args.data.length === 1) {
      const f = this.database.resolveResult(this.args.data[0])
      result = result.filter((s) => Number(s[f]))
    }

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

    if (this.args.data.length) {
      chart.datasets.length = 0
      this.args.data.map(() => {
        const measurement = this.measurement
        // swap any measurement dependency here
        const field = this.database.resolveResult(measurement)

        const offsetData = this.generateOffsetData(result, xlabelFormat, field)

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
      })
    }

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

  private generatePlaceholderLabels(
    results: any[],
    labelFormat: string
  ): string[] {
    const labels = []
    const startDate = moment(this.criteria.startDate).startOf('day')
    const endDate = moment(this.criteria.endDate).endOf('day')
    const currentDate =
      this.criteria.timeframe === 'alltime'
        ? moment(results[0].recordedAt).startOf('day')
        : startDate
    while (currentDate.isSameOrBefore(endDate)) {
      const formattedDate = currentDate.format(labelFormat)
      labels.push(formattedDate)
      currentDate.add(1, this.args.timeframe === 'day' ? 'hour' : 'day')
    }

    return labels
  }

  private generateOffsetData(
    results: any[],
    labelFormat: string,
    field: string
  ) {
    const resultArray = []
    results = [...results]

    if (Array.isArray(field)) {
      results.forEach((result) => {
        const resultCache = []
        field.forEach((f) => {
          const value = this.formatters[this.measurement]
            ? this.formatters[this.measurement][1](result[f])
            : result[f].toFixed(1)
          this.min =
            this.min === undefined || value < this.min
              ? Math.floor(value)
              : this.min
          this.max = !this.max || value > this.max ? Math.ceil(value) : this.max
          resultCache.push({
            x: moment(result.date).startOf('hour').format(labelFormat),
            y: value
          })
        })

        resultArray.push(resultCache)
      })
    } else {
      results.forEach((result) => {
        const value = this.formatters[this.measurement]
          ? this.formatters[this.measurement][1](result[field])
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
    }

    return resultArray
  }
}
