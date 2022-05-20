import {
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
  ViewChild,
  ViewEncapsulation
} from '@angular/core'
import { ActivatedRoute, ParamMap, Router } from '@angular/router'
import { CCRConfig } from '@app/config'
import { resolveConfig } from '@app/config/section'
import {
  MeasurementDatabase,
  MeasurementDataSource
} from '@app/dashboard/accounts/dieters/services'
import {
  ContextService,
  EventsService,
  ExtendedMeasurementLabelEntry,
  MeasurementAggregation,
  MeasurementDataSourceV2,
  MeasurementSummaryData,
  MeasurementTimeframe,
  NotifierService,
  SelectedOrganization
} from '@app/service'
import { _, DateNavigatorOutput } from '@app/shared'
import { CcrPaginatorComponent } from '@coachcare/common/components'
import { Store } from '@ngrx/store'
import { TranslateService } from '@ngx-translate/core'
import { filter, uniq } from 'lodash'
import * as moment from 'moment-timezone'
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy'
import { Subject } from 'rxjs'
import { MeasurementChartOutput } from './chart/chart.component'
import { MeasurementLabelEntry } from '@coachcare/sdk'
import { filter as rxJsFilter } from 'rxjs/operators'

export type MeasurementSections =
  | 'composition'
  | 'circumference'
  | 'energy'
  | 'food'
  | 'vitals'
export type MeasurementDataElement = {
  code: MeasurementSummaryData
  displayName: string
  dynamic?: boolean
  limitEntries?: boolean
}
export type MeasurementConfig = {
  [key: string]: {
    data: MeasurementDataElement[]
    columns: string[]
    allowDetail?: boolean
    useNewEndpoint?: boolean
  }
}

@UntilDestroy()
@Component({
  selector: 'app-dieter-measurements',
  templateUrl: 'measurements.component.html',
  styleUrls: ['measurements.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class DieterMeasurementsComponent implements OnInit, OnDestroy {
  @ViewChild(CcrPaginatorComponent, { static: true })
  paginator: CcrPaginatorComponent

  @ViewChild('paginatorV2', { static: true })
  paginatorV2: CcrPaginatorComponent

  // controls with their config
  aggregation: MeasurementAggregation
  allowListView = false
  components = ['food']
  component = ''
  sections: MeasurementConfig = {
    food: {
      data: [
        { code: 'calories', displayName: _('MEASUREMENT.CALORIES') },
        { code: 'protein', displayName: _('BOARD.PROTEIN') },
        { code: 'carbohydrates', displayName: _('MEASUREMENT.CARBS') },
        { code: 'totalFat', displayName: _('BOARD.FAT') }
      ],
      columns: ['date', 'calories', 'protein', 'carbohydrates', 'totalFat']
    }
  }
  public selectedLabel: MeasurementLabelEntry
  public sourceV2?: MeasurementDataSourceV2

  timeframe = 'week'
  view = 'table'
  dates: DateNavigatorOutput = {}
  data: MeasurementSummaryData[]
  chartColumns: string[]
  columns: string[]
  filteredColumns: string[] = []
  additionalColumns: string[] = []
  useNewTable = true
  useNewEndpoint: boolean
  useSnapshot = false
  zendeskLink =
    'https://coachcare.zendesk.com/hc/en-us/articles/360020245112-Viewing-a-Patient-s-Measurements'

  // datasource refresh trigger
  refresh$ = new Subject<string>()

  source: MeasurementDataSource | null

  hiddenMeasurementTabs: string[] = []

  constructor(
    private cdr: ChangeDetectorRef,
    private route: ActivatedRoute,
    private router: Router,
    private translator: TranslateService,
    private context: ContextService,
    private bus: EventsService,
    private notifier: NotifierService,
    private database: MeasurementDatabase,
    private store: Store<CCRConfig>
  ) {}

  ngOnInit() {
    this.bus.trigger('right-panel.component.set', 'addMeasurements')
    this.source = new MeasurementDataSource(
      this.notifier,
      this.database,
      this.translator,
      this.context,
      this.store
    )
    this.source.result$.pipe(untilDestroyed(this)).subscribe((values) => {
      const allColumns = this.sections[this.section]?.columns.slice() ?? []
      const dynamicColumns =
        this.sections[this.section]?.data
          .filter((element) => element.dynamic)
          .map((element) => element.code) ?? []
      let filteredColumns = []

      filteredColumns = allColumns.filter(
        (column) =>
          !this.filteredColumns.find(
            (filteredColumn) => column === filteredColumn
          )
      )

      if (dynamicColumns.length) {
        filteredColumns = filteredColumns.filter(
          (column) =>
            !dynamicColumns.find((dynamicColumn) => dynamicColumn === column) ||
            !!values.find((val) => val[column] !== 0)
        )
      } else {
        filteredColumns = allColumns
      }

      const additionalColumns =
        this.section === 'vitals'
          ? resolveConfig(
              'JOURNAL.ADDITIONAL_VITALS_COLUMNS',
              this.context.organization
            )
          : []

      filteredColumns = filteredColumns.concat(additionalColumns)

      this.columns = filteredColumns
    })

    this.source.addDefault({
      account: this.context.accountId
    })

    this.source.addOptional(
      this.refresh$.pipe(rxJsFilter(() => this.section === 'food')),
      () => {
        return {
          data:
            this.view === 'table' || this.view === 'list'
              ? this.data
              : this.source.getData(),
          timeframe:
            this.view !== 'list'
              ? (this.dates.timeframe as MeasurementTimeframe)
              : undefined,
          // aggregation: this.aggregation,
          startDate:
            this.view !== 'list'
              ? moment(this.dates.startDate).toISOString()
              : undefined,
          endDate:
            this.view !== 'list'
              ? moment(this.dates.endDate).toISOString()
              : undefined,
          unit: 'day',
          useNewEndpoint: this.useNewEndpoint,
          max: 'all',
          omitEmptyDays:
            this.view === 'chart' || this.view === 'list' ? true : false,
          limitEntries: this.sections[this.section]?.data.some(
            (type) => type.limitEntries
          )
        }
      }
    )

    this.source.addOptional(this.paginator.page, () =>
      this.view === 'list'
        ? {
            offset: this.source.pageIndex * this.source.pageSize,
            limit: this.source.pageSize
          }
        : {}
    )

    // component initialization
    this.route.paramMap.subscribe((params: ParamMap) => {
      // TODO add timeframe, date
      const s = params.get('s') as string
      this.section = this.components.includes(s) ? s : this.component

      const v = params.get('v')
      this.view = ['table', 'chart', 'list'].includes(v) ? v : this.view

      const d = params.get('d')

      if (d) {
        const endDate = moment(d)

        this.updateDates({
          current: endDate.format('YYYY-MM-DD'),
          timeframe: 'week'
        })
      }

      if (
        this.view === 'list' &&
        !this.sections[this.section]?.useNewEndpoint
      ) {
        this.view = 'table'
      }

      if (!this.allowListView && this.view === 'list') {
        this.view = 'table'
      } else if (
        this.view === 'table' &&
        this.useNewEndpoint &&
        this.allowListView
      ) {
        this.view = 'list'
      }

      this.cdr.detectChanges()
    })

    this.cdr.detectChanges()
    this.bus.register('dieter.measurement.refresh', this.refreshData.bind(this))

    this.context.organization$
      .pipe(untilDestroyed(this))
      .subscribe((organization: SelectedOrganization) => {
        this.allowListView = resolveConfig(
          'JOURNAL.ALLOW_MEASUREMENT_LIST_VIEW',
          this.context.organization
        )

        this.useSnapshot = this.allowListView ?? false

        this.filteredColumns = resolveConfig(
          'JOURNAL.HIDDEN_COMPOSITION_COLUMNS',
          this.context.organization
        )

        this.additionalColumns =
          this.section === 'vitals'
            ? resolveConfig(
                'JOURNAL.ADDITIONAL_VITALS_COLUMNS',
                this.context.organization
              )
            : []

        if (!this.allowListView && this.view === 'list') {
          this.view = 'table'
        } else if (
          this.view === 'table' &&
          this.useNewEndpoint &&
          this.allowListView
        ) {
          this.view = 'list'
        }

        this.resolveHiddenMeasurementTabs(organization)

        this.chartColumns = uniq(
          this.chartColumns.concat(this.additionalColumns)
        )

        this.source.refresh()
      })
    this.resolveHiddenMeasurementTabs(this.context.organization)
  }

  ngOnDestroy() {
    this.source.disconnect()

    this.bus.unregister('dieter.measurement.refresh')
  }

  onAggChange(aggregation: MeasurementAggregation) {
    this.aggregation = aggregation
    this.refreshData()
  }

  get section(): string {
    return this.component
  }
  set section(target: string) {
    const sectionsTarget = this.sections[target] ?? null
    this.component = target
    this.data = sectionsTarget
      ? sectionsTarget.data.map((data) => data.code)
      : []
    this.useNewEndpoint = sectionsTarget ? sectionsTarget.useNewEndpoint : true
    this.columns = sectionsTarget ? sectionsTarget.columns : []
    this.chartColumns = sectionsTarget ? sectionsTarget.columns : []

    if (this.filteredColumns && this.filteredColumns.length) {
      this.chartColumns = this.chartColumns.filter(
        (column) =>
          !this.filteredColumns.find(
            (filteredColumn) => filteredColumn === column
          )
      )
    }

    if (
      !this.source.measurement ||
      !filter(this.data, this.source.measurement).length
    ) {
      this.source.measurement = this.data[0]
    }
    this.refresh$.next('measurements.section')
    this.bus.trigger('add-measurement.section.change', { value: target })
    this.cdr.detectChanges()
  }

  toggleView(mode?: string) {
    if (this.view === 'chart') {
      this.timeframe = 'week'
    }
    const params = {
      s: this.component,
      v: mode ? mode : this.view === 'table' ? 'chart' : 'table'
    }
    void this.router.navigate(['.', params], {
      relativeTo: this.route
    })
  }

  updateDates(dates: DateNavigatorOutput) {
    this.dates = dates
    this.refresh$.next('measurements.updateDates')
    // prevents exception when changing timeframe from child component
    this.cdr.detectChanges()
  }

  chartV2Changed(data: { timeframe: string }) {
    this.timeframe = data.timeframe
  }

  chartChanged(data: MeasurementChartOutput) {
    this.aggregation = data.aggregation
    this.source.measurement = data.measurement
    if (this.timeframe !== data.timeframe) {
      this.timeframe = data.timeframe
      // and the date-navigator will trigger the update
    } else {
      this.refresh$.next('measurements.chartChanged')
    }
  }

  public onSelectTab(label: ExtendedMeasurementLabelEntry | string): void {
    const labelEntry: ExtendedMeasurementLabelEntry =
      label as ExtendedMeasurementLabelEntry

    if (label === 'food') {
      this.section = label
      this.useNewTable = false
      return
    }

    this.selectedLabel = labelEntry
    this.section = labelEntry.routeLink

    this.useNewTable = true
  }

  refreshData(): void {
    this.source.refresh()
  }

  private resolveHiddenMeasurementTabs(organization: SelectedOrganization) {
    this.hiddenMeasurementTabs =
      resolveConfig('JOURNAL.HIDDEN_MEASUREMENT_TABS', organization) || []
  }
}
