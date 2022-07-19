import { Component, OnInit } from '@angular/core'
import { MatDialog } from '@angular/material/dialog'
import { StorefrontOrderDetailsDialog } from '@coachcare/storefront/dialogs'
import { StorefrontOrderEntry } from '@coachcare/storefront/model'
import { StorefrontOrdersDatabase } from '@coachcare/storefront/services'
import { StorefrontOrdersDataSource } from '@coachcare/storefront/services/account-orders/account-orders.datasource'
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy'

@UntilDestroy()
@Component({
  selector: 'ccr-storefront-order-history',
  templateUrl: './order-history.component.html',
  styleUrls: ['./order-history.component.scss']
})
export class StorefrontOrderHistoryPageComponent implements OnInit {
  public orders: StorefrontOrderEntry[] = []
  public source: StorefrontOrdersDataSource
  columns = ['id', 'date', 'total', 'actions']
  constructor(
    private dialog: MatDialog,
    private database: StorefrontOrdersDatabase
  ) {}

  public ngOnInit(): void {
    this.createSource()
  }

  private createSource(): void {
    this.source = new StorefrontOrdersDataSource(this.database)

    this.source
      .connect()
      .pipe(untilDestroyed(this))
      .subscribe((orders) => (this.orders = orders))
  }

  public openOrderDetailsDialog(order: StorefrontOrderEntry): void {
    this.dialog.open(StorefrontOrderDetailsDialog, {
      data: { order },
      width: '60vw'
    })
  }
}
