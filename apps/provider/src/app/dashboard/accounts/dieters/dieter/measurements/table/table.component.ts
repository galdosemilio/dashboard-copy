import { Component, Input, OnDestroy, OnInit } from '@angular/core'
import { MatDialog } from '@coachcare/material'
import { MeasurementDetailDialog } from '@app/dashboard/accounts/dialogs'
import { MeasurementDataSource } from '@app/dashboard/accounts/dieters/services'
import { ContextService, NotifierService } from '@app/service'
import { _, PromptDialog } from '@app/shared'
import { untilDestroyed } from 'ngx-take-until-destroy'
import { AccountMeasurementPreferenceType } from '@coachcare/npm-api'
import { MeasurementConfig } from '../measurements.component'

@Component({
  selector: 'app-dieter-measurements-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss']
})
export class MeasurementTableComponent implements OnDestroy, OnInit {
  @Input()
  set columns(columns: string[]) {
    setTimeout(() => this.refreshColumns(columns))
  }

  get columns(): string[] {
    return this._columns
  }
  @Input() section = ''
  @Input() source: MeasurementDataSource | null
  @Input() sections: MeasurementConfig

  measurementPreference: AccountMeasurementPreferenceType

  private _columns: string[] = []
  private appendedColumns: string[] = ['actions']

  visceralFatRatingTooltip = {
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
    ]
  }

  constructor(
    private context: ContextService,
    private dialog: MatDialog,
    private notify: NotifierService
  ) {}

  ngOnDestroy() {}

  ngOnInit() {
    this.measurementPreference = this.context.user.measurementPreference
  }

  deleteBodyMeasurement(row: any) {
    if (!row.device) {
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
      .pipe(untilDestroyed(this))
      .subscribe(async (confirm: boolean) => {
        try {
          if (confirm) {
            await this.source.deleteBodyMeasurement({ id: row.id })
            this.source.refresh()
          }
        } catch (error) {
          this.notify.error(error)
        }
      })
  }

  showMeasurementsModal(row: any) {
    if (this.sections[this.section].allowDetail) {
      this.dialog
        .open(MeasurementDetailDialog, {
          data: {
            account: this.context.accountId,
            row: row,
            section: this.section,
            sections: this.sections
          },
          panelClass: 'ccr-full-dialog'
        })
        .afterClosed()
        .pipe(untilDestroyed(this))
        .subscribe((refresh: boolean) => {
          if (refresh) {
            this.source.refresh()
          }
        })
    }
  }

  private refreshColumns(columns: string[]) {
    this._columns = [
      ...columns,
      ...(this.sections[this.section].allowDetail ? this.appendedColumns : [])
    ]
  }
}
