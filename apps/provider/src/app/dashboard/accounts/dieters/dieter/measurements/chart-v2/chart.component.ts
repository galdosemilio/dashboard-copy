import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  HostBinding,
  Input,
  OnInit,
  Output
} from '@angular/core'
import {
  ConfigService,
  ContextService,
  MeasurementLabelService,
  NotifierService
} from '@app/service'
import { ChartData, DateNavigatorOutput, SelectOptions, _ } from '@app/shared'
import { Subject } from 'rxjs'
import {
  MeasurementChartDataSource,
  MeasurementDatabaseV2,
  MeasurementTimeframe
} from '../../../services'
import * as moment from 'moment'
import { Store } from '@ngrx/store'
import { CCRConfig } from '@app/config'
import { filter, merge, uniqBy } from 'lodash'
import {
  MeasurementDataPointMinimalType,
  MeasurementLabelEntry,
  NamedEntity
} from '@coachcare/sdk'
import { SYNTHETIC_DATA_TYPES } from '@app/dashboard/accounts/dieters/models'
import { TranslateService } from '@ngx-translate/core'

@Component({
  selector: 'app-dieter-measurements-chart-v2',
  templateUrl: './chart.component.html',
  host: { class: 'ccr-chart' }
})
export class MeasurementChartV2Component implements OnInit {
  @Input()
  @HostBinding('class.ccr-chart-embedded')
  embedded = false

  @Input() set dates(dates: DateNavigatorOutput) {
    this._dates = dates
    this.dates$.next(this._dates)
  }

  get dates(): DateNavigatorOutput {
    return this._dates
  }

  @Input() set label(label: MeasurementLabelEntry) {
    this._label = label
    void this.resolveTypes()
  }

  get label(): MeasurementLabelEntry {
    return this._label
  }

  @Input()
  timeframe: MeasurementTimeframe = 'week'

  @Output()
  onChange = new EventEmitter<{ timeframe: string }>()

  public chart: ChartData
  public types: NamedEntity[] = []
  public source: MeasurementChartDataSource

  private dates$: Subject<DateNavigatorOutput> = new Subject<DateNavigatorOutput>()
  private _dates: DateNavigatorOutput
  private _label: MeasurementLabelEntry

  // views selector
  viewTypes: SelectOptions<MeasurementTimeframe> = [
    { value: 'day', viewValue: _('SELECTOR.VIEWBY.DAY') },
    { value: 'week', viewValue: _('SELECTOR.VIEWBY.WEEK') },
    { value: 'month', viewValue: _('SELECTOR.VIEWBY.MONTH') },
    { value: 'year', viewValue: _('SELECTOR.VIEWBY.YEAR') },
    { value: 'alltime', viewValue: _('SELECTOR.VIEWBY.ALL_TIME') }
  ]
  viewby: SelectOptions<MeasurementTimeframe> = []

  constructor(
    private cdr: ChangeDetectorRef,
    private config: ConfigService,
    private context: ContextService,
    private database: MeasurementDatabaseV2,
    private measurementLabel: MeasurementLabelService,
    private notifier: NotifierService,
    private store: Store<CCRConfig>,
    private translate: TranslateService
  ) {}

  public ngOnInit(): void {
    this.createDataSource()
    this.buildViews([])
  }

  public refresh(): void {
    this.source?.refresh()
  }

  public onTimeframeChange(): void {
    this.onChange.emit({ timeframe: this.timeframe })
  }

  private buildViews(enabled: string[]) {
    this.viewby = this.viewTypes.slice()

    if (
      this.viewby.length &&
      !filter(this.viewby, { value: this.timeframe }).length
    ) {
      this.timeframe = this.viewby[0].value
    }
  }

  private createDataSource(): void {
    this.source = new MeasurementChartDataSource(
      this.database,
      this.store,
      this.context,
      this.translate
    )

    if (this.types.length) {
      this.source.type = this.types[0].id
    }

    this.source.addDefault({ account: this.context.accountId, limit: 'all' })
    this.source.addRequired(this.dates$, () => ({
      recordedAt: {
        start: moment(this.dates.startDate).startOf('day').toISOString(),
        end: moment(this.dates.endDate).endOf('day').toISOString()
      }
    }))

    this.source.chart().subscribe((chart) => {
      this.chart = null
      this.cdr.detectChanges()
      this.chart = {}
      merge(this.chart, this.config.get('chart').factory('line'), chart)
    })

    this.dates$.next(this.dates)
  }

  private async resolveTypes(): Promise<void> {
    try {
      const types = (
        await this.measurementLabel.resolveLabelDataPointTypes(this.label)
      ).map((assoc) => assoc.type)

      if (!types.length) {
        if (this.source) {
          this.source.type = ''
        }
        this.types = []
        return
      }

      if (this.source) {
        this.source.type = types[0].id
      }

      this.types = this.parseWithSyntheticTypes(types)
      this.refresh()
    } catch (error) {
      this.notifier.error(error)
    }
  }

  private parseWithSyntheticTypes(
    types: MeasurementDataPointMinimalType[]
  ): NamedEntity[] {
    return uniqBy(
      types.map((type) => ({
        id: type.id,
        name:
          SYNTHETIC_DATA_TYPES.find((syntheticType) =>
            syntheticType.sourceTypeIds.includes(type.id)
          )?.name ?? type.name
      })),
      'name'
    )
  }
}
