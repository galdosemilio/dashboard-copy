import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild
} from '@angular/core'
import {
  ContextService,
  EventsService,
  LanguageService,
  LOAD_MORE_ROW_BASE,
  MeasurementDatabaseV2,
  MeasurementDataPointGroupTableEntry,
  MeasurementDataSourceV2,
  MeasurementLabelService,
  MEASUREMENT_MAX_ENTRIES_PER_DAY,
  NotifierService
} from '@app/service'
import {
  CcrTableSortDirective,
  DateNavigatorOutput,
  PromptDialog
} from '@app/shared'
import { _ } from '@app/shared/utils'
import {
  convertUnitToPreferenceFormat,
  DataPointTypes,
  GetMeasurementDataPointGroupsResponse,
  MeasurementDataPointGroup,
  MeasurementDataPointMinimalType,
  MeasurementDataPointProvider,
  MeasurementDataPointType,
  MeasurementLabelEntry,
  MeasurementUnitConversions
} from '@coachcare/sdk'
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy'
import { Subject } from 'rxjs'
import * as moment from 'moment'
import { MatDialog } from '@coachcare/material'
import { filter } from 'rxjs/operators'
import { TranslateService } from '@ngx-translate/core'
import { CcrPaginatorComponent } from '@coachcare/common/components'
import { STORAGE_MEASUREMENT_LIST_SORT } from '@app/config'
import { resolveConfig } from '@app/config/section'
import { measurementTableRowMapper } from '@app/service/measurement-v2/helpers'

@UntilDestroy()
@Component({
  selector: 'app-dieter-measurements-table-v2',
  templateUrl: './measurements-table.component.html',
  styleUrls: ['./measurements-table.component.scss']
})
export class MeasurementsTableV2Component implements OnInit {
  @Input() set dates(dates: DateNavigatorOutput) {
    this._dates = dates
    this.dates$.next(this._dates)
  }

  get dates(): DateNavigatorOutput {
    return this._dates
  }

  @Input() set label(label: MeasurementLabelEntry) {
    this._label = label
    void this.refreshColumns()
  }

  get label(): MeasurementLabelEntry {
    return this._label
  }

  @Input() paginator?: CcrPaginatorComponent
  @Input() useSnapshot = false

  @Output()
  sourceRef: EventEmitter<MeasurementDataSourceV2> = new EventEmitter<MeasurementDataSourceV2>()

  @ViewChild(CcrTableSortDirective, { static: true })
  sort: CcrTableSortDirective

  public columns: MeasurementDataPointType[] = []
  public isLoadingMore = false
  public rows: MeasurementDataPointGroupTableEntry[] = []
  public source: MeasurementDataSourceV2
  public visceralFatRatingTooltip = {
    title: {
      text: _('MEASUREMENT.VISCERAL_FAT_TANITA.TOOLTIP.TITLE')
    },
    rowHeight: 20,
    cols: 7,
    contents: [
      {
        class: 'grid-dialog-highlight grid-dialog-tile-center',
        rows: 3,
        cols: 1,
        text: _('MEASUREMENT.VISCERAL_FAT_TANITA.TOOLTIP.RATING')
      },
      {
        class:
          'grid-dialog-highlight grid-dialog-tile-center grid-dialog-tile-padding-sm',
        rows: 1,
        cols: 2,
        text: _('MEASUREMENT.VISCERAL_FAT_TANITA.TOOLTIP.STANDARD')
      },
      {
        class:
          'grid-dialog-highlight grid-dialog-tile-center grid-dialog-tile-padding-sm',
        rows: 1,
        cols: 2,
        text: _('MEASUREMENT.VISCERAL_FAT_TANITA.TOOLTIP.HIGH')
      },
      {
        class:
          'grid-dialog-highlight grid-dialog-tile-center grid-dialog-tile-padding-sm',
        rows: 1,
        cols: 2,
        text: _('MEASUREMENT.VISCERAL_FAT_TANITA.TOOLTIP.VERY_HIGH')
      },
      {
        class: 'sz-md-14',
        rows: 2,
        cols: 2,
        text: _('MEASUREMENT.VISCERAL_FAT_TANITA.TOOLTIP.BELOW_10')
      },
      {
        class: 'sz-md-14',
        rows: 2,
        cols: 2,
        text: _('MEASUREMENT.VISCERAL_FAT_TANITA.TOOLTIP.10_14')
      },
      {
        class: 'sz-md-14',
        rows: 2,
        cols: 2,
        text: _('MEASUREMENT.VISCERAL_FAT_TANITA.TOOLTIP.ABOVE_15')
      },
      {
        class: 'grid-dialog-highlight grid-dialog-tile-center',
        rows: 6,
        cols: 1,
        text: _('MEASUREMENT.VISCERAL_FAT_TANITA.TOOLTIP.JUDGEMENT')
      },
      {
        class: 'grid-dialog-tile-padding-sm sz-md-13',
        rows: 6,
        cols: 2,
        text: _('MEASUREMENT.VISCERAL_FAT_TANITA.TOOLTIP.CONTINUE_MONITORING')
      },
      {
        class: 'grid-dialog-tile-padding-sm sz-md-13',
        rows: 6,
        cols: 2,
        text: _('MEASUREMENT.VISCERAL_FAT_TANITA.TOOLTIP.CONSIDER_CHANGING')
      },
      {
        class: 'grid-dialog-tile-padding-sm sz-md-13',
        rows: 6,
        cols: 2,
        text: _('MEASUREMENT.VISCERAL_FAT_TANITA.TOOLTIP.SHOULD_ENGAGE')
      }
    ],
    dir: 'ltr'
  }

  private _dates: DateNavigatorOutput
  private _label: MeasurementLabelEntry
  private dates$: Subject<DateNavigatorOutput> =
    new Subject<DateNavigatorOutput>()
  private columns$: Subject<void> = new Subject<void>()

  constructor(
    private bus: EventsService,
    private context: ContextService,
    private database: MeasurementDatabaseV2,
    private dataPoint: MeasurementDataPointProvider,
    private dialog: MatDialog,
    private language: LanguageService,
    private measurementLabel: MeasurementLabelService,
    private notifier: NotifierService,
    private translate: TranslateService
  ) {}

  public ngOnInit(): void {
    this.visceralFatRatingTooltip.dir = this.language.getDir()
    void this.refreshColumns()
    this.createDataSource()
    this.subscribeToEvents()
  }

  public getDistanceUnit(): string {
    return MeasurementUnitConversions['m'].getMeasurementPreferenceUnit(
      this.context.user.measurementPreference
    )
  }

  public getGroupDistance(group: MeasurementDataPointGroup): string | null {
    const stepsDataPoint = group.dataPoints.find(
      (dataPoint) => dataPoint.type.id === DataPointTypes.STEPS
    )

    if (!stepsDataPoint) {
      return null
    }

    const distance = stepsDataPoint.value * 0.75758

    return MeasurementUnitConversions['m']
      .convertToReadableFormat(
        distance,
        this.context.user.measurementPreference
      )
      .toFixed(1)
  }

  public getGroupType(
    group: MeasurementDataPointGroup,
    typeId: string
  ): MeasurementDataPointMinimalType {
    return (
      group.dataPoints.find((dataPoint) => dataPoint.type.id === typeId)
        ?.type ?? null
    )
  }

  public getGroupUnit(
    group: MeasurementDataPointGroup,
    typeId: string
  ): string {
    return convertUnitToPreferenceFormat(
      group.dataPoints.find((dataPoint) => dataPoint.type.id === typeId)?.type,
      this.context.user.measurementPreference,
      this.translate.currentLang
    )
  }

  public getGroupValue(
    group: MeasurementDataPointGroup,
    typeId: string
  ): number | null {
    return (
      group.dataPoints.find((dataPoint) => dataPoint.type.id === typeId)
        ?.value ?? null
    )
  }

  public getGroupWeightProportion(
    group: MeasurementDataPointGroup,
    typeId: string
  ): number | null {
    const percentageEntry = group.dataPoints.find(
      (dataPoint) => dataPoint.type.id === typeId
    )
    const percentage = percentageEntry?.value ?? null

    if (percentage === null) {
      return null
    }

    const weight =
      group.dataPoints.find((dataPoint) => dataPoint.type.id === '1')?.value ??
      null

    return weight !== null
      ? weight * (percentage / (percentageEntry.type.multiplier * 100))
      : null
  }

  public onDeleteGroup(group: MeasurementDataPointGroup): void {
    if (!(group as MeasurementDataPointGroupTableEntry).canBeDeleted) {
      return
    }

    this.dialog
      .open(PromptDialog, {
        data: {
          title: _('MEASUREMENT.DELETE'),
          content: _('MEASUREMENT.DELETE_CONTENT')
        }
      })
      .afterClosed()
      .pipe(filter((del) => del))
      .subscribe(() => {
        void this.deleteMeasurementGroup(group)
      })
  }

  public async onLoadMore(
    row: MeasurementDataPointGroupTableEntry,
    index: number
  ): Promise<void> {
    if (this.isLoadingMore) {
      return
    }

    try {
      this.isLoadingMore = true
      const recordDate = moment(row.recordedAt.utc)
      const recordQuery =
        this.source._criteria.sort[0].dir === 'asc'
          ? {
              start: recordDate.add(1, 'ms').toISOString(),
              end: recordDate.endOf('day').toISOString()
            }
          : {
              end: recordDate.subtract(1, 'ms').toISOString(),
              start: recordDate.startOf('day').toISOString()
            }

      const response = await this.database.fetch({
        ...this.source._criteria,
        recordedAt: recordQuery,
        timezone: row.recordedAt.timezone,
        limit: MEASUREMENT_MAX_ENTRIES_PER_DAY
      })

      this.rows = this.calculateUpdatedRows(response, index)
    } catch (error) {
      this.notifier.error(error)
    } finally {
      this.isLoadingMore = false
    }
  }

  private attemptResolveSort(listViewEnabled = false): void {
    try {
      const storageSort = JSON.parse(
        window.localStorage.getItem(STORAGE_MEASUREMENT_LIST_SORT)
      )

      if (storageSort) {
        return this.sort.sort$.next(storageSort)
      }

      if (listViewEnabled) {
        this.sort.sort$.next({
          dir: 'desc',
          property: 'recordedAt'
        })
      }
    } catch (error) {
      this.sort.sort$.next({
        dir: 'asc',
        property: 'recordedAt'
      })
    }
  }

  private calculateUpdatedRows(
    response: GetMeasurementDataPointGroupsResponse,
    index: number
  ): MeasurementDataPointGroupTableEntry[] {
    const entries = response.data

    const blockedDataPointAssocIds = this.measurementLabel.dataPointTypes
      .filter((assoc) => !assoc.provider.isModifiable)
      .map((assoc) => assoc.type.id)

    const mappedEntries = entries
      .map((group, idx, groups) => [group, groups[idx - 1]])
      .map(([current, previous]) =>
        measurementTableRowMapper(
          [current, previous],
          blockedDataPointAssocIds,
          this.source.listView
        )
      )

    const lastExistingGroup = mappedEntries.slice().pop()

    const allEntries = response.pagination.next
      ? [
          ...mappedEntries,
          {
            ...LOAD_MORE_ROW_BASE,
            account: { id: this.source._criteria.account },
            createdAt: lastExistingGroup?.createdAt ?? {
              local: '',
              utc: '',
              timezone: ''
            },
            recordedAt: lastExistingGroup?.recordedAt ?? {
              local: '',
              utc: '',
              timezone: ''
            }
          }
        ]
      : mappedEntries

    const updatedRows = this.rows.slice()
    updatedRows.splice(index, 1, ...allEntries)

    return updatedRows
  }

  private createDataSource(): void {
    const allowListView = resolveConfig(
      'JOURNAL.ALLOW_MEASUREMENT_LIST_VIEW',
      this.context.organization
    )

    this.attemptResolveSort(allowListView)

    this.source = new MeasurementDataSourceV2(
      this.database,
      this.measurementLabel,
      this.sort
    )

    this.source.listView = allowListView

    this.source.addDefault({
      limit: 'all'
    })
    this.source.addRequired(this.dates$, () => ({
      recordedAt: {
        start: moment(this.dates.startDate).startOf('day').toISOString(),
        end: moment(this.dates.endDate).endOf('day').toISOString()
      },
      useSnapshot: this.useSnapshot
    }))
    this.source.addRequired(this.context.account$, () => ({
      account: this.context.accountId
    }))
    this.source.addRequired(this.columns$, () => ({
      type: this.columns
        .map((type) => type.id)
        .filter((id) => !isNaN(Number(id)))
    }))

    this.setUpPaginator()

    this.sort.sortChange.pipe(untilDestroyed(this)).subscribe((res) => {
      if (res[0]?.dir) {
        window.localStorage.setItem(
          STORAGE_MEASUREMENT_LIST_SORT,
          JSON.stringify(res[0])
        )
      } else {
        window.localStorage.removeItem(STORAGE_MEASUREMENT_LIST_SORT)
      }
    })

    this.source
      .connect()
      .pipe(untilDestroyed(this))
      .subscribe((groups) => {
        this.rows = groups
      })

    this.dates$.next(this.dates)
  }

  private async deleteMeasurementGroup(
    group: MeasurementDataPointGroup
  ): Promise<void> {
    try {
      await this.dataPoint.deleteGroup({ id: group.id })
      this.notifier.success(_('NOTIFY.SUCCESS.MEASUREMENT_DELETED'))
      this.source.refresh()
    } catch (error) {
      this.notifier.error(error)
    }
  }

  private async refreshColumns(): Promise<void> {
    try {
      const associations =
        await this.measurementLabel.resolveLabelDataPointTypes(this.label)

      this.columns = associations.map((assoc) => assoc.type)

      const stepIndex = this.columns.findIndex(
        (col) => col.id === DataPointTypes.STEPS
      )

      if (stepIndex > -1) {
        this.columns.splice(stepIndex + 1, 0, {
          id: 'distance',
          name: _('MEASUREMENT.DISTANCE'),
          accessibility: 'public',
          bound: { lower: 0, upper: 0 },
          status: 'active',
          multiplier: 1,
          span: undefined
        })
      }

      this.columns$.next()
    } catch (error) {
      this.notifier.error(error)
    }
  }

  private setUpPaginator(): void {
    if (!this.paginator) {
      return
    }

    this.source.omitEmptyDays = true

    this.paginator.page
      .pipe(untilDestroyed(this))
      .subscribe(($event) => (this.source.pageIndex = $event.pageIndex))

    this.source.addOptional(this.paginator.page, () => ({
      offset: this.source.pageIndex * this.source.pageSize,
      limit: this.source.pageSize
    }))

    this.sourceRef.emit(this.source)
  }

  private subscribeToEvents(): void {
    this.bus.listen('dieter.measurement.refresh', () => this.source.refresh())
  }
}
