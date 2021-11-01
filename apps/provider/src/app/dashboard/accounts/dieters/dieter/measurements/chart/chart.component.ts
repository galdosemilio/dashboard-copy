import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  HostBinding,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output
} from '@angular/core'
import {
  MeasurementAggregation,
  MeasurementDataSource,
  MAX_ENTRIES_PER_DAY
} from '@app/dashboard/accounts/dieters/services'
import {
  MeasurementSummaryData,
  MeasurementTimeframe
} from '@app/dashboard/accounts/dieters/services'
import { ConfigService } from '@app/service'
import { _, ChartData, DateNavigatorOutput, SelectOptions } from '@app/shared'
import { filter, merge } from 'lodash'
import * as moment from 'moment-timezone'
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy'
import { Subject } from 'rxjs'
import { ChartPluginsOptions } from 'chart.js'

export interface MeasurementChartOutput {
  aggregation: MeasurementAggregation
  measurement: MeasurementSummaryData
  timeframe: MeasurementTimeframe
}

@UntilDestroy()
@Component({
  selector: 'app-dieter-measurements-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.scss'],
  host: { class: 'ccr-chart' }
})
export class MeasurementChartComponent implements OnInit, OnChanges, OnDestroy {
  @Input()
  @HostBinding('class.ccr-chart-embedded')
  embedded = false

  @Input()
  source: MeasurementDataSource
  @Input()
  metrics: MeasurementSummaryData[] = []
  @Input()
  views: MeasurementTimeframe[] = []
  @Input()
  timeframe: MeasurementTimeframe = 'week'

  @Output()
  change = new EventEmitter<MeasurementChartOutput>()

  aggregation: MeasurementAggregation
  chart: ChartData
  plugins: ChartPluginsOptions = [
    {
      id: 'day-offset',
      afterUpdate: (chart) => {
        if (this.timeframe === 'year' || this.timeframe === 'alltime') {
          return
        }

        const tickSlotAmount = this.timeframe === 'week' ? 8 : 31
        const dataset = chart.config.data.datasets[0]
        const metadata: ChartData = Object.values(dataset._meta)[0]

        if (!metadata) {
          return
        }

        const chartWidth = metadata.data[0]._xScale.width
        const offset = chartWidth / tickSlotAmount / MAX_ENTRIES_PER_DAY

        let previousDate = ''
        let cumulativeOffset = 0

        metadata.data.forEach((entry, index) => {
          const dataEntry = dataset.data[index]
          const isSameDate = previousDate.includes(dataEntry.x)

          cumulativeOffset = isSameDate ? cumulativeOffset + offset : 0
          entry._model.x += cumulativeOffset

          previousDate = dataEntry.x
        })
      }
    }
  ]

  // measurements selector
  measurementTypes: SelectOptions<MeasurementSummaryData> = [
    { value: 'weight', viewValue: _('MEASUREMENT.WEIGHT') },
    { value: 'bmi', viewValue: _('MEASUREMENT.BMI') },
    { value: 'bodyFat', viewValue: _('MEASUREMENT.BODY_FAT') },
    { value: 'leanMass', viewValue: _('MEASUREMENT.LEAN_MASS') },
    {
      value: 'visceralFatPercentage',
      viewValue: _('MEASUREMENT.VISCERAL_FAT')
    },
    {
      value: 'visceralFatTanita',
      viewValue: _('MEASUREMENT.VISCERAL_FAT_TANITA.VISCERAL_FAT_TANITA')
    },
    {
      value: 'visceralAdiposeTissue',
      viewValue: _('MEASUREMENT.VISCERAL_ADIP_TISSUE')
    },
    { value: 'waterPercentage', viewValue: _('MEASUREMENT.HYDRATION') },
    { value: 'steps', viewValue: _('MEASUREMENT.STEPS') },
    { value: 'average', viewValue: _('MEASUREMENT.STEP_AVERAGE') },
    { value: 'distance', viewValue: _('MEASUREMENT.DISTANCE') },
    { value: 'total', viewValue: _('MEASUREMENT.SLEEP') },
    { value: 'sleepQuality', viewValue: _('MEASUREMENT.RESTFULNESS') },
    { value: 'waist', viewValue: _('MEASUREMENT.WAIST') },
    { value: 'arm', viewValue: _('MEASUREMENT.ARM') },
    { value: 'chest', viewValue: _('MEASUREMENT.CHEST') },
    { value: 'hip', viewValue: _('MEASUREMENT.HIP') },
    { value: 'thigh', viewValue: _('MEASUREMENT.THIGH') },
    { value: 'neck', viewValue: _('MEASUREMENT.NECK') },
    { value: 'thorax', viewValue: _('MEASUREMENT.THORAX') },
    { value: 'calories', viewValue: _('MEASUREMENT.CALORIES') },
    { value: 'protein', viewValue: _('BOARD.PROTEIN') },
    { value: 'carbohydrates', viewValue: _('MEASUREMENT.CARBS') },
    { value: 'totalFat', viewValue: _('BOARD.FAT') },
    {
      value: 'totalCholesterol',
      viewValue: _('MEASUREMENT.TOTAL_CHOLESTEROL')
    },
    { value: 'ldl', viewValue: _('MEASUREMENT.LOW_DENSITY_LIPOPROTEIN') },
    { value: 'hdl', viewValue: _('MEASUREMENT.HIGH_DENSITY_LIPOPROTEIN') },
    { value: 'vldl', viewValue: _('MEASUREMENT.VERY_LOW_DENSITY_LIPOPROTEIN') },
    { value: 'triglycerides', viewValue: _('MEASUREMENT.TRIGLYCERIDES') },
    { value: 'fastingGlucose', viewValue: _('MEASUREMENT.FASTING_GLUCOSE') },
    { value: 'hba1c', viewValue: _('MEASUREMENT.HBA1C') },
    { value: 'insulin', viewValue: _('MEASUREMENT.INSULIN') },
    { value: 'hsCrp', viewValue: _('MEASUREMENT.HIGH_SENSITIVITY_C_REACTIVE') },
    { value: 'heartRate', viewValue: _('MEASUREMENT.HEART_RATE') },
    { value: 'temperature', viewValue: _('MEASUREMENT.TEMPERATURE') },
    { value: 'respirationRate', viewValue: _('MEASUREMENT.RESPIRATION_RATE') },
    {
      value: 'bloodOxygenLevel',
      viewValue: _('MEASUREMENT.BLOOD_OXYGEN')
    },
    {
      value: 'bloodPressureString',
      viewValue: _('MEASUREMENT.BLOOD_PRESSURE')
    },
    {
      value: 'extracellularWaterToBodyWater',
      viewValue: _('MEASUREMENT.EXTRACELLULAR_WATER')
    },
    { value: 'totalBodyWater', viewValue: _('MEASUREMENT.TOTAL_BODY_WATER') },
    { value: 'visceralFatMass', viewValue: _('MEASUREMENT.VISCERAL_FAT_MASS') },
    { value: 'insulin', viewValue: _('MEASUREMENT.INSULIN') },
    { value: 'ketones', viewValue: _('MEASUREMENT.KETONES') }
  ]
  measurements: SelectOptions<MeasurementSummaryData> = []

  // views selector
  viewTypes: SelectOptions<MeasurementTimeframe> = [
    { value: 'day', viewValue: _('SELECTOR.VIEWBY.DAY') },
    { value: 'week', viewValue: _('SELECTOR.VIEWBY.WEEK') },
    { value: 'month', viewValue: _('SELECTOR.VIEWBY.MONTH') },
    { value: 'year', viewValue: _('SELECTOR.VIEWBY.YEAR') },
    { value: 'alltime', viewValue: _('SELECTOR.VIEWBY.ALL_TIME') }
  ]
  viewby: SelectOptions<MeasurementTimeframe> = []

  // dates navigator store
  dates: DateNavigatorOutput = {}

  // refresh chart trigger
  refresh$ = new Subject<any>()

  constructor(private cdr: ChangeDetectorRef, private config: ConfigService) {}

  ngOnInit() {
    this.source.addDefault({
      omitEmptyDays: true
    })
    if (!this.embedded) {
      // takes the control of all the API parameters
      this.source.register('chart', true, this.refresh$, () => {
        // adjust the unit according to the selected timeframe
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        let unit
        switch (this.dates.timeframe) {
          case 'week':
            unit = 'day'
            break
          case 'month':
            unit = 'week'
            break
          case 'year':
          case 'alltime':
          default:
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            unit = 'month'
        }
        return {
          data: this.source.getData(),
          // aggregation: this.aggregation,
          timeframe: this.dates.timeframe as MeasurementTimeframe,
          startDate: moment(this.dates.startDate).format('YYYY-MM-DD'),
          endDate: moment(this.dates.endDate).format('YYYY-MM-DD'),
          max: 'all',
          unit: 'day', // unit
          inferLastEntry: true
        }
      })
    } else {
      // let the parent take the control
      this.source.register('chart', false, this.refresh$, () => ({
        limitEntries: true
      }))
    }

    this.source
      .chart()
      .pipe(untilDestroyed(this))
      .subscribe((chart) => {
        this.chart = undefined // force refresh on change
        this.cdr.detectChanges()
        this.chart = {}
        merge(this.chart, this.config.get('chart').factory('line'), chart)
      })

    this.cdr.detectChanges()
  }

  ngOnDestroy() {
    this.source.unregister('chart')
  }

  ngOnChanges(changes) {
    if (changes.metrics) {
      this.buildMeasurements(changes.metrics.currentValue)
    }
    if (changes.views) {
      this.buildViews(changes.views.currentValue)
    }
  }

  private onAggChange(aggregation: MeasurementAggregation) {
    this.aggregation = aggregation ? aggregation : undefined
    this.refresh()
  }

  private buildMeasurements(enabled: string[]) {
    this.measurements = this.measurementTypes.filter((v) => {
      return enabled.indexOf(v.value) > -1
    })
    if (
      this.measurements.length &&
      !filter(this.measurements, { value: this.source.measurement }).length
    ) {
      this.source.measurement = this.measurements[0].value
    }
  }

  private buildViews(enabled: string[]) {
    this.viewby = this.viewTypes.filter((v) => {
      return enabled.indexOf(v.value) > -1
    })
    if (
      this.viewby.length &&
      !filter(this.viewby, { value: this.timeframe }).length
    ) {
      this.timeframe = this.viewby[0].value
    }
  }

  refresh() {
    this.change.emit({
      aggregation: this.aggregation,
      measurement: this.source.measurement,
      timeframe: this.timeframe
    })
    this.cdr.detectChanges()
    if (!this.embedded) {
      this.refresh$.next('chart.refresh')
    }
  }

  updateDates(dates: DateNavigatorOutput) {
    this.dates = dates
    this.refresh$.next(true)
  }
}
