import { Component, Input, OnInit } from '@angular/core'
import { ContextService, NotifierService } from '@app/service'
import { CcrDropEvent, _ } from '@app/shared'
import { PromptDialog } from '@coachcare/common/dialogs/core'
import { MatDialog } from '@coachcare/material'
import {
  convertUnitToPreferenceFormat,
  MeasurementDataPointMinimalType,
  MeasurementDataPointTypeAssociation,
  MeasurementDataPointTypeProvider,
  MeasurementLabelProvider
} from '@coachcare/sdk'
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy'
import { filter } from 'rxjs/operators'
import {
  EditMeasurementLabelDialog,
  EditMeasurementLabelDialogProps
} from '../../../dialogs'
import {
  MeasurementLabelDataSource,
  MeasurementLabelTableEntry
} from '../../../services'

@UntilDestroy()
@Component({
  selector: 'app-clinic-measurement-labels',
  templateUrl: './measurement-labels.component.html',
  styleUrls: ['./measurement-labels.component.scss']
})
export class ClinicMeasurementLabelsComponent implements OnInit {
  @Input() disableActions: boolean
  @Input() reordering = false
  @Input() source: MeasurementLabelDataSource

  public rows: MeasurementLabelTableEntry[] = []

  constructor(
    private context: ContextService,
    private dataPointType: MeasurementDataPointTypeProvider,
    private dialog: MatDialog,
    private measurementLabel: MeasurementLabelProvider,
    private notifier: NotifierService
  ) {}

  public ngOnInit(): void {
    this.subscribeToSource()
  }

  public async onDropRow(
    $event: CcrDropEvent<MeasurementLabelTableEntry>
  ): Promise<void> {
    try {
      if (
        $event.drag.level !== $event.drop.level ||
        $event.drag.sortOrder === $event.drop.sortOrder - 1
      ) {
        return
      }

      if ($event.drag.level === 0) {
        await this.handleDropEventAsLabel($event)
      } else {
        await this.handleDropEventAsDataPointType($event)
      }
    } catch (error) {
      this.notifier.error(error)
    }
  }

  public convertUnitToReadableFormat(
    type: MeasurementDataPointMinimalType
  ): string {
    return convertUnitToPreferenceFormat(
      type,
      this.context.user.measurementPreference
    )
  }

  public toggleRow(row: MeasurementLabelTableEntry): void {
    row.isExpanded = !row.isExpanded
    row.children.forEach((child) => (child.isHidden = !child.isHidden))
  }

  public showDeleteRowDialog(row: MeasurementLabelTableEntry): void {
    if (this.disableActions) {
      return
    }

    switch (row.level) {
      case 0:
        this.showDeleteMeasurementLabelDialog(row)
        break
      case 1:
        this.showDeleteDataPointTypeDialog(
          row as MeasurementDataPointTypeAssociation
        )
        break
      default:
        // no action
        break
    }
  }

  public showEditRowDialog(row: MeasurementLabelTableEntry): void {
    if (this.disableActions) {
      return
    }

    this.dialog
      .open(EditMeasurementLabelDialog, {
        data: { label: row } as EditMeasurementLabelDialogProps,
        width: '60vw'
      })
      .afterClosed()
      .pipe(filter((refresh) => refresh))
      .subscribe(() => this.source.refresh())
  }

  public async updateVisibility(
    row,
    prop: 'isModifiable' | 'isExposed' | 'isDefault',
    type: 'provider' | 'client' = 'client'
  ): Promise<void> {
    try {
      if (type === 'client') {
        row.client[prop] = row.client[prop] === 'true'

        await this.dataPointType.updateAssociation({
          id: row.id,
          isExposedToClient: row.client.isExposed,
          isModifiableByClient: row.client.isModifiable,
          isClientDefault: row.client.isDefault
        })
      } else {
        row.provider[prop] = row.provider[prop] === 'true'

        await this.dataPointType.updateAssociation({
          id: row.id,
          isModifiableByProvider: row.provider.isModifiable
        })
      }

      this.notifier.success(_('NOTIFY.SUCCESS.DATA_POINT_UPDATED'))
    } catch (error) {
      this.notifier.error(error)
    }
  }

  private async deleteMeasurementLabel(
    row: MeasurementLabelTableEntry
  ): Promise<void> {
    try {
      await this.measurementLabel.update({
        id: row.id,
        status: 'inactive'
      })
      this.source.refresh()
      this.notifier.success(_('NOTIFY.SUCCESS.MEASUREMENT_LABEL_DELETED'))
    } catch (error) {
      this.notifier.error(error)
    }
  }

  private async handleDropEventAsDataPointType(
    $event: CcrDropEvent<MeasurementLabelTableEntry>
  ): Promise<void> {
    try {
      await this.dataPointType.updateAssociation({
        id: $event.drag.id,
        sortOrder: $event.drop.sortOrder
      })

      this.notifier.success(_('NOTIFY.SUCCESS.DATA_POINT_SORTED_SUCCESSFULLY'))
      this.source.refresh({
        expandedLabels: this.source.result.filter((label) => label.isExpanded)
      })
    } catch (error) {
      console.error(error)
      this.notifier.error(error)
    }
  }

  private async handleDropEventAsLabel(
    $event: CcrDropEvent<MeasurementLabelTableEntry>
  ): Promise<void> {
    try {
      await this.measurementLabel.update({
        id: $event.drag.id,
        sortOrder: $event.drop.sortOrder
      })

      this.notifier.success(_('NOTIFY.SUCCESS.LABEL_SORTED_SUCCESSFULLY'))
      this.source.refresh()
    } catch (error) {
      this.notifier.error(error)
    }
  }

  private async deleteDataPointType(
    row: MeasurementDataPointTypeAssociation
  ): Promise<void> {
    try {
      await this.dataPointType.deleteAssociation({
        id: row.id
      })

      this.source.refresh({
        expandedLabels: this.source.result.filter((label) => label.isExpanded)
      })
      this.notifier.success(_('NOTIFY.SUCCESS.DATA_POINT_TYPE_HIDDEN'))
    } catch (error) {
      this.notifier.error(error)
    }
  }

  private showDeleteDataPointTypeDialog(
    row: MeasurementDataPointTypeAssociation
  ): void {
    this.dialog
      .open(PromptDialog, {
        data: {
          content: _('BOARD.CLINIC_DELETE_DATA_POINT_TYPE_DESCRIPTION'),
          contentParams: { id: row.id, name: row.type.name },
          title: _('BOARD.CLINIC_DELETE_DATA_POINT_TYPE')
        }
      })
      .afterClosed()
      .pipe(filter((confirm) => confirm))
      .subscribe(() => this.deleteDataPointType(row))
  }

  private showDeleteMeasurementLabelDialog(
    row: MeasurementLabelTableEntry
  ): void {
    this.dialog
      .open(PromptDialog, {
        data: {
          content: _('BOARD.CLINIC_DELETE_MEASUREMENT_LABEL_DESCRIPTION'),
          contentParams: row,
          title: _('BOARD.CLINIC_DELETE_MEASUREMENT_LABEL')
        }
      })
      .afterClosed()
      .pipe(filter((confirm) => confirm))
      .subscribe(() => this.deleteMeasurementLabel(row))
  }

  private subscribeToSource(): void {
    this.source
      .connect()
      .pipe(untilDestroyed(this))
      .subscribe((labels) => (this.rows = labels))
  }
}
