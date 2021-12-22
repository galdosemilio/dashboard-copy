import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core'
import {
  ContextService,
  EventsService,
  LanguageService,
  MeasurementDatabaseV2,
  MeasurementDataPointGroupTableEntry,
  MeasurementDataSourceV2,
  MeasurementLabelService,
  NotifierService
} from '@app/service'
import { DateNavigatorOutput, PromptDialog } from '@app/shared'
import { _ } from '@app/shared/utils'
import {
  convertUnitToPreferenceFormat,
  DataPointTypes,
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

  public columns: MeasurementDataPointType[] = []
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
  private dates$: Subject<DateNavigatorOutput> = new Subject<DateNavigatorOutput>()
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

  public convertToHms(seconds: number): string {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    return `${hours}:${('00' + minutes).substr(-2, 2)}`
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

  private createDataSource(): void {
    this.source = new MeasurementDataSourceV2(
      this.database,
      this.measurementLabel
    )

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
      this.notifier.success('Measurement deleted successfully')
      this.source.refresh()
    } catch (error) {
      this.notifier.error(error)
    }
  }

  private async refreshColumns(): Promise<void> {
    try {
      const associations = await this.measurementLabel.resolveLabelDataPointTypes(
        this.label
      )

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
