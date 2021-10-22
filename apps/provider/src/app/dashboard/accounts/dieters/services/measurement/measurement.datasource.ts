import { CCRConfig, CCRPalette } from '@app/config'
import { ContextService, NotifierService } from '@app/service'
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
import { Entity, FetchBodyMeasurementDataResponse } from '@coachcare/sdk'
import { paletteSelector } from '@app/store/config'
import { select, Store } from '@ngrx/store'
import { TranslateService } from '@ngx-translate/core'
import { isArray, merge, uniqBy } from 'lodash'
import * as moment from 'moment-timezone'
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy'
import { from, Observable, Subject } from 'rxjs'
import { BodyMeasurement } from '../../models/measurement/bodyMeasurement'
import {
  MeasurementAggregation,
  MeasurementCriteria,
  MeasurementSummaryData,
  MeasurementSummarySegment
} from './measurement.criteria'
import { MeasurementDatabase } from './measurement.database'

const MAX_ENTRIES_PER_DAY = 5

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
  requiresWeight: MeasurementSummaryData[] = ['bodyFat', 'leanMass']

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

  deleteBodyMeasurement(args: Entity): Promise<void> {
    return this.database.deleteBodyMeasurement(args)
  }

  fetch(criteria): Observable<Array<APISummaryResponse>> {
    return from(
      new Promise<APISummaryResponse[]>(async (resolve, reject) => {
        try {
          let response
          if (!criteria.useNewEndpoint) {
            response = await this.database.fetchAllSummary({
              ...criteria,
              startDate: moment(criteria.startDate)
                .startOf('day')
                .format('YYYY-MM-DD'),
              endDate: moment(criteria.endDate)
                .endOf('day')
                .format('YYYY-MM-DD')
            })

            const mergedData = []

            response.forEach((element) => {
              const array = element.data || element
              array.forEach((data, index) => {
                data.date = moment(data.date, 'YYYY-MM-DD').toISOString()
                mergedData[index] = { ...data, ...mergedData[index] }
              })
            })

            response.forEach((element) => {
              element.data
                ? (element.data = mergedData)
                : (element = mergedData)
            })

            const cleanResponse = response.map((summary) => {
              if (summary.data) {
                return {
                  summary: summary.summary,
                  data: summary.data.map(
                    (element) =>
                      new BodyMeasurement(element, {
                        measurementPreference: this.context.user
                          .measurementPreference,
                        timeframe: this.criteria.timeframe
                      })
                  )
                }
              } else {
                return summary.map(
                  (element) =>
                    new BodyMeasurement(element, {
                      measurementPreference: this.context.user
                        .measurementPreference,
                      timeframe: this.criteria.timeframe
                    })
                )
              }
            })

            return resolve(cleanResponse)
          }

          response = await this.database.fetchBodyMeasurement({
            account: criteria.account,
            recordedAt:
              criteria.startDate && criteria.endDate
                ? {
                    start: moment(criteria.startDate)
                      .startOf('day')
                      .toISOString(),
                    end: moment(criteria.endDate).endOf('day').toISOString()
                  }
                : undefined,
            limit: criteria.limit || 'all',
            offset: criteria.offset || 0,
            includes: criteria.data.map((data) => ({
              property: data,
              positiveOnly: false
            }))
          })

          this.total = response.pagination.next
            ? response.pagination.next + 1
            : this.criteria.offset + response.data.length

          this.hasTooMuchForSingleDay = false

          let result: BodyMeasurement[] = []
          const cleanMeasurements = response.data.map(
            (element) =>
              new BodyMeasurement(element, {
                measurementPreference: this.context.user.measurementPreference
              })
          )

          const preprocessedMeasurements: BodyMeasurement[][] = this.preprocessMeasurements(
            cleanMeasurements
          )

          result = this.criteria.aggregation
            ? this.criteria.aggregation.type === 'highest' ||
              this.criteria.aggregation.type === 'lowest'
              ? this.processAsHighestOrLowest(
                  preprocessedMeasurements,
                  this.criteria.aggregation.type,
                  this.criteria.aggregation.property
                )
              : this.processAll(preprocessedMeasurements)
            : this.processAll(preprocessedMeasurements)

          if (
            criteria.inferLastEntry &&
            result[result.length - 1] &&
            !result[result.length - 1][this.measurement]
          ) {
            result[result.length - 1] = this.inferLastMeasurement(
              response.data.slice(),
              response.data[0]
            )
          }

          resolve([{ data: result, summary: {} }])
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

    if (this.requiresWeight.indexOf(this.measurement) > -1) {
      this.hasMissingWeight = result.some((element) => !element.weight)
      this.missingWeightDates = uniqBy(
        result
          .filter((element) => !element.weight)
          .map((element) => element.date),
        (element) => element.split('T')[0]
      )
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

  getData(): Array<MeasurementSummaryData> {
    switch (this.measurement) {
      case 'bloodPressureString':
        return ['bloodPressureSystolic', 'bloodPressureDiastolic']
      case 'distance':
        return ['distance', 'steps']
      case 'bodyFat':
      case 'leanMass':
        return ['bodyFat', 'weight']
      default:
        return [this.measurement]
    }
  }

  getField(field: string): string | string[] {
    switch (field) {
      case 'bloodPressureString':
        return ['bloodPressureSystolic', 'bloodPressureDiastolic']
      default:
        return field
    }
  }

  private preprocessMeasurements(
    measurements: BodyMeasurement[]
  ): BodyMeasurement[][] {
    const groupedMeasurements: BodyMeasurement[][] = this.groupBy(
      measurements,
      (measurement) => moment(measurement.recordedAt).format('YYYY-MM-DD')
    )

    const preprocessedMeasurements = this.criteria.limitEntries
      ? groupedMeasurements.map((group) => {
          if (group.length > 5) {
            this.hasTooMuchForSingleDay = true
            group = group.slice(0, MAX_ENTRIES_PER_DAY)
          }

          return group
        })
      : groupedMeasurements

    if (!this.criteria.omitEmptyDays && this.criteria.timeframe !== 'alltime') {
      this.addEmptyDays(preprocessedMeasurements)
    } else if (!this.criteria.startDate && !this.criteria.endDate) {
      this.addHeaderDays(preprocessedMeasurements)
    }
    preprocessedMeasurements.sort((a, b) =>
      a[0].recordedAt < b[0].recordedAt ? -1 : 1
    )

    preprocessedMeasurements.forEach((preprocessed, index) => {
      if (preprocessed.length > 1) {
        preprocessed.sort((a, b) =>
          a.recordedAt < b.recordedAt
            ? -1
            : a.recordedAt > b.recordedAt
            ? 1
            : a.id < b.id
            ? -1
            : 1
        )
      }

      preprocessed[0].even = index % 2 === 0
      preprocessed[0].odd = !preprocessed[0].even

      preprocessed.forEach((element) => {
        element.usesNewAPI = true
        element.odd = preprocessed[0].odd
        element.even = preprocessed[0].even
      })
    })
    return preprocessedMeasurements
  }

  private processAll(
    preprocessedMeasurements: BodyMeasurement[][]
  ): BodyMeasurement[] {
    const mostRecentResults: BodyMeasurement[] = []

    preprocessedMeasurements.forEach((day: BodyMeasurement[]) => {
      day.forEach((measurement) => {
        mostRecentResults.push(measurement)
      })
    })

    return mostRecentResults
  }

  private processAsHighestOrLowest(
    preprocessedMeasurements: BodyMeasurement[][],
    dir: MeasurementAggregation,
    property: string
  ): BodyMeasurement[] {
    const highestOrLowest: BodyMeasurement[] = []

    preprocessedMeasurements.forEach((day: BodyMeasurement[]) => {
      const sortedByProperty = day.sort((prev, next) => {
        if (prev[property] > next[property]) {
          return 1
        } else if (prev[property] < next[property]) {
          return -1
        } else {
          return 0
        }
      })

      if (dir === 'highest') {
        highestOrLowest.push(sortedByProperty.pop())
      } else {
        highestOrLowest.push(sortedByProperty.shift())
      }
    })

    return highestOrLowest
  }

  private addEmptyDays(groupedDays: BodyMeasurement[][]) {
    let endDate = moment(this.args.endDate)
    const emptyMeasurement = new BodyMeasurement({})

    if (endDate.isAfter(moment(), 'day')) {
      endDate = endDate.add(1, 'day')
    }

    for (
      let currentDate = moment(this.args.startDate).startOf('day');
      currentDate <= endDate;
      currentDate = currentDate.add(1, 'day')
    ) {
      const currentFormattedDate = currentDate.toISOString()
      const groupIndex = groupedDays.findIndex(
        (day) =>
          day[0].recordedAt.split('T')[0] === currentFormattedDate.split('T')[0]
      )
      const emptyMeasurementItem = { ...emptyMeasurement }
      emptyMeasurementItem.recordedAt = currentFormattedDate
      emptyMeasurementItem.date = emptyMeasurementItem.recordedAt
      emptyMeasurementItem.isEmpty = true
      if (groupIndex === -1) {
        groupedDays.push([emptyMeasurementItem])
      } else {
        emptyMeasurementItem.isHeader = true
        groupedDays[groupIndex].splice(0, 0, emptyMeasurementItem)
      }
    }
  }

  private addHeaderDays(groupedDays: BodyMeasurement[][]) {
    const emptyMeasurement = new BodyMeasurement({})

    groupedDays.forEach((dayGroup: BodyMeasurement[]) => {
      const emptyMeasurementItem = { ...emptyMeasurement }
      emptyMeasurementItem.recordedAt = moment(dayGroup[0].recordedAt)
        .startOf('day')
        .toISOString()
      emptyMeasurementItem.date = emptyMeasurementItem.recordedAt
      emptyMeasurementItem.isEmpty = true
      emptyMeasurementItem.isHeader = true
      dayGroup.splice(0, 0, emptyMeasurementItem)
    })
  }

  private generatePlaceholderLabels(
    results: any[],
    labelFormat: string
  ): string[] {
    const labels = []
    const startDate = moment(this.criteria.startDate)
    const endDate = moment(this.criteria.endDate)
    const currentDate =
      this.criteria.timeframe === 'alltime'
        ? moment(results[0].recordedAt).startOf('day')
        : startDate
    while (currentDate.isSameOrBefore(endDate)) {
      const formattedDate = currentDate.format(labelFormat)
      labels.push(formattedDate)
      currentDate.add(1, 'day')
    }

    return labels
  }

  private generateOffsetData(
    results: any[],
    labelFormat: string,
    field: string
  ) {
    const cleanField = this.getField(field)
    const resultArray = []
    results = [...results]

    if (Array.isArray(cleanField)) {
      results.forEach((result) => {
        const resultCache = []
        cleanField.forEach((f) => {
          const value = this.formatters[this.measurement]
            ? this.formatters[this.measurement][1](result[f])
            : result[f].toFixed(1)
          this.min =
            this.min === undefined || value < this.min
              ? Math.floor(value)
              : this.min
          this.max = !this.max || value > this.max ? Math.ceil(value) : this.max
          resultCache.push({
            x: moment(result.date).format(labelFormat),
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

  private groupBy(array, groupBy) {
    const groups = {}
    array.forEach((item) => {
      const groupName = JSON.stringify(groupBy(item))
      groups[groupName] = groups[groupName] || []
      groups[groupName].push(item)
    })

    return Object.keys(groups).map((group) => {
      return groups[group]
    })
  }

  private inferLastMeasurement(
    result: BodyMeasurement[],
    originalResult: FetchBodyMeasurementDataResponse
  ): BodyMeasurement {
    let props = this.getData()
    const inferredProps = {}

    while (result.length && props.length) {
      const resultItem = result.shift()

      const iterationProps = props.slice()

      iterationProps.forEach((prop, index) => {
        inferredProps[prop] = resultItem[prop] || undefined

        if (inferredProps[prop]) {
          props = props.filter((propItem, propIndex) => propIndex !== index)
        }
      })
    }

    return new BodyMeasurement(
      { ...originalResult, ...inferredProps },
      {
        measurementPreference: this.context.user.measurementPreference
      }
    )
  }
}
