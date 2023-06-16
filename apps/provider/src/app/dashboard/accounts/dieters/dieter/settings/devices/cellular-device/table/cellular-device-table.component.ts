import { Component, OnInit, Input } from '@angular/core'
import { CellularDeviceDataSource } from '../../../services/cellular-device/cellular-device.datasource'
import { CellularDeviceDatabase } from '../../../services'
import { ContextService } from '@app/service'
import { AccountCellularDevice } from '@coachcare/sdk'
import { MatDialog } from '@coachcare/material'
import { BodytraceSyncDialog } from '@app/shared'

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

    await this.database.remove(req)
    this.source.refresh()
  }

  public showDialog(row: AccountCellularDevice): void {
    this.dialog.open(BodytraceSyncDialog, {
      data: { id: row.id }
    })
  }
}
