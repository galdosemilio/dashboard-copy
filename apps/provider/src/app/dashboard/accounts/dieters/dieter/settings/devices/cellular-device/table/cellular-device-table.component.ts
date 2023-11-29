import { Component, OnInit, Input } from '@angular/core'
import { CellularDeviceDataSource } from '../../../services/cellular-device/cellular-device.datasource'
import { CellularDeviceDatabase } from '../../../services'
import { ContextService } from '@app/service'
import { AccountCellularDevice } from '@coachcare/sdk'
import { MatDialog } from '@coachcare/material'
import { BodytraceSyncDialog, PromptDialog, _ } from '@app/shared'
import { filter } from 'rxjs'

@Component({
  selector: 'app-cellular-device-table',
  templateUrl: './cellular-device-table.component.html'
})
export class CellularDeviceTableComponent implements OnInit {
  @Input() source: CellularDeviceDataSource
  @Input() columns = [
    'device_type',
    'device_number',
    'account',
    'createdAt',
    'actions'
  ]

  constructor(
    private context: ContextService,
    private database: CellularDeviceDatabase,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.source = new CellularDeviceDataSource(this.context, this.database)
  }

  public onAdd(): void {
    this.source.refresh()
  }

  public async onRemove(row: AccountCellularDevice): Promise<void> {
    const req = {
      account: row.account.id,
      id: row.id
    }

    this.dialog
      .open(PromptDialog, {
        data: {
          title: _('BOARD.CLINIC_REMOVE_DEVICE'),
          content: _('BOARD.CLINIC_REMOVE_DEVICE_DESCRIPTION'),
          contentParams: {
            id: row.device.identifier
          }
        }
      })
      .afterClosed()
      .pipe(filter((confirm) => confirm))
      .subscribe(() => {
        void this.removeDevice(req)
      })
  }

  public showDialog(row: AccountCellularDevice): void {
    this.dialog.open(BodytraceSyncDialog, {
      data: { id: row.id }
    })
  }

  private async removeDevice(req: {
    account: string
    id: string
  }): Promise<void> {
    await this.database.remove(req)
    this.source.refresh()
  }
}
