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
  EventsService,
  MeasurementChartDataSource,
  MeasurementDatabaseV2,
  MeasurementTimeframe
} from '@app/service'
import { ChartData } from '@app/shared/model'
import { DateNavigatorOutput } from '@app/shared/components'
import { SelectOptions, _ } from '@app/shared/utils'
import { Subject } from 'rxjs'
import * as moment from 'moment'
import { Store } from '@ngrx/store'
import { filter, merge, uniqBy } from 'lodash'
import {
  MeasurementDataPointTypeAssociation,
  MeasurementLabelEntry,
  NamedEntity
} from '@coachcare/sdk'
import { SYNTHETIC_DATA_TYPES } from '@app/dashboard/accounts/dieters/models'
import { TranslateService } from '@ngx-translate/core'
import { ChartPluginsOptions } from 'chart.js'
import { AppState } from '@app/store/state'
import { selectCurrentLabelTypes } from '@app/store/measurement-label'
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy'
export interface TypeGroupEntry extends NamedEntity {
  types: NamedEntity[]
}

@UntilDestroy()
@Component({
  selector: 'ccr-measurements-chart-v2',
  templateUrl: './chart.component.html',
  host: { class: 'ccr-chart' }
})
export class CcrMeasurementChartV2Component implements OnInit {
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
  }

  get label(): MeasurementLabelEntry {
    return this._label
  }

  @Input() set typeGroups(groups: TypeGroupEntry[]) {
    this._typeGroups = groups.map((group: TypeGroupEntry) => {
      group.types = this.parseWithSyntheticTypes(group.types)
      return group
    })
  }

  get typeGroups(): TypeGroupEntry[] {
    return this._typeGroups
  }

  @Input()
  timeframe: MeasurementTimeframe = 'month'

  @Output()
  onChange = new EventEmitter<{ timeframe: string }>()

  public chart: ChartData
  public types: NamedEntity[] = []
  public source: MeasurementChartDataSource
  public plugins: ChartPluginsOptions = [
    {
      id: 'day-offset',
      afterUpdate: (chart) => {
        if (this.timeframe === 'year' || this.timeframe === 'alltime') {
          return
        }
      }
    }
  ]

  private dates$: Subject<DateNavigatorOutput> =
    new Subject<DateNavigatorOutput>()
  private _dates: DateNavigatorOutput
  private _label?: MeasurementLabelEntry
  private _typeGroups?: TypeGroupEntry[]

  // views selector
  viewTypes: SelectOptions<MeasurementTimeframe> = [
    { value: 'day', viewValue: _('SELECTOR.VIEWBY.DAY') },
    { value: 'week', viewValue: _('SELECTOR.VIEWBY.WEEK') },
    { value: 'month', viewValue: _('SELECTOR.VIEWBY.MONTH') },
    { value: 'threeMonths', viewValue: _('SELECTOR.VIEWBY.THREE_MONTHS') },
    { value: 'sixMonths', viewValue: _('SELECTOR.VIEWBY.SIX_MONTHS') },
    { value: 'year', viewValue: _('SELECTOR.VIEWBY.YEAR') },
    { value: 'alltime', viewValue: _('SELECTOR.VIEWBY.ALL_TIME') }
  ]
  viewby: SelectOptions<MeasurementTimeframe> = []

  constructor(
    private cdr: ChangeDetectorRef,
    private config: ConfigService,
    private context: ContextService,
    private database: MeasurementDatabaseV2,
    private store: Store<AppState>,
    private translate: TranslateService,
    private bus: EventsService
  ) {
    this.resolveTypes = this.resolveTypes.bind(this)
  }

  public ngOnInit(): void {
    this.bus.register('summary-boxes.device-type.change', (deviceType) => {
      this.source.type = deviceType
      this.refresh()
    })
    this.dates = this.dates ?? {
      current: moment().startOf('day').toISOString(),
      endDate: moment().endOf('week').toISOString(),
      startDate: moment().startOf('week').toISOString()
    }

    this.createDataSource()
    this.buildViews([])

    if (this.typeGroups) {
      this.source.type = this.typeGroups[0]?.types[0]?.id
      this.refresh()
      return
    }

    this.store
      .select(selectCurrentLabelTypes)
      .pipe(untilDestroyed(this))
      .subscribe(this.resolveTypes)
  }

  public refresh(): void {
    this.source?.refresh()
  }

  public onTimeframeChange(): void {
    this.source.timeframe = this.timeframe
    this.onChange.emit({ timeframe: this.timeframe })
  }

  public updateDates(dates: DateNavigatorOutput): void {
    this.dates = dates
    // prevents exception when changing timeframe from child component
    this.cdr.detectChanges()
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
      this.source.timeframe = this.timeframe
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

  private resolveTypes(
    typeAssocs: MeasurementDataPointTypeAssociation[]
  ): void {
    const types = typeAssocs.map((assoc) => assoc.type)

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
  }

  private parseWithSyntheticTypes(types: NamedEntity[]): NamedEntity[] {
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
