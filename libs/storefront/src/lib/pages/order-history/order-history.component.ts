import { Component, AfterViewInit, ViewChild } from '@angular/core'
import { MatDialog } from '@angular/material/dialog'
import { MatPaginator } from '@angular/material/paginator'
import { MatSort } from '@angular/material/sort'
import { SpreeProvider } from '@coachcare/sdk'
import { StorefrontOrderDetailsDialog } from '@coachcare/storefront/dialogs'
import {
  StorefrontOrderEntry,
  StorefrontOrdersResponse
} from '@coachcare/storefront/model'
import { StorefrontService } from '@coachcare/storefront/services'
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy'
import { OrderAttr } from '@spree/storefront-api-v2-sdk/types/interfaces/Order'
import { catchError, from, map, merge, of, startWith, switchMap } from 'rxjs'

@UntilDestroy()
@Component({
  selector: 'ccr-storefront-order-history',
  templateUrl: './order-history.component.html',
  styleUrls: ['./order-history.component.scss']
})
export class StorefrontOrderHistoryPageComponent implements AfterViewInit {
  public orders: StorefrontOrderEntry[] = []
  public totalCount: number
  public perPage: number = 5
  public isLoading: boolean = true
  columns = ['id', 'date', 'total', 'actions']

  @ViewChild(MatPaginator) paginator: MatPaginator
  @ViewChild(MatSort) sort: MatSort

  constructor(
    private spreeProvider: SpreeProvider,
    private storefrontService: StorefrontService,
    private dialog: MatDialog
  ) {}

  public ngAfterViewInit(): void {
    this.sort.sortChange.subscribe(() => (this.paginator.pageIndex = 0))

    merge(this.sort.sortChange, this.paginator.page)
      .pipe(
        startWith({}),
        switchMap(() => {
          this.isLoading = true
          return from(
            this.spreeProvider.getOrders({
              per_page: this.paginator.pageSize,
              page: this.paginator.pageIndex + 1,
              sort: this.sort.direction === 'asc' ? 'created_at' : '-created_at'
            })
          ).pipe(
            catchError((err) => {
              this.storefrontService.error$.next(err)
              return of({
                data: [],
                meta: {}
              })
            })
          )
        }),
        map((entry: StorefrontOrdersResponse) => {
          this.isLoading = false
          this.totalCount = entry.meta.total_count
          return entry.data.map(
            (entry) => new StorefrontOrderEntry(entry as OrderAttr)
          )
        })
      )
      .pipe(untilDestroyed(this))
      .subscribe((orders: StorefrontOrderEntry[]) => {
        this.orders = orders
      })
  }

  public openOrderDetailsDialog(order: StorefrontOrderEntry): void {
    this.dialog.open(StorefrontOrderDetailsDialog, {
      data: { order },
      width: '60vw'
    })
  }
}
