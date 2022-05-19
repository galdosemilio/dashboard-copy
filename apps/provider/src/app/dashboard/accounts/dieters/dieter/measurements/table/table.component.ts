import { Component, Input, OnInit } from '@angular/core'
import { MeasurementDataSource } from '@app/dashboard/accounts/dieters/services'
import { ContextService } from '@app/service'
import { _ } from '@app/shared'
import { AccountMeasurementPreferenceType } from '@coachcare/sdk'
import { MeasurementConfig } from '../measurements.component'

@Component({
  selector: 'app-dieter-measurements-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss']
})
export class MeasurementTableComponent implements OnInit {
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

  constructor(private context: ContextService) {}

  public ngOnInit(): void {
    this.measurementPreference = this.context.user.measurementPreference
  }

  private refreshColumns(columns: string[]) {
    this._columns = [
      ...columns,
      ...(this.sections[this.section]?.allowDetail ? this.appendedColumns : [])
    ]
  }
}
