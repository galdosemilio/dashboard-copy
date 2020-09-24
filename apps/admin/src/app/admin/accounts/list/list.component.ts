import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@coachcare/layout';
import { ActivatedRoute } from '@angular/router';
import { AccountsDataSource } from '@coachcare/backend/data';
import { getterPaginator } from '@coachcare/backend/model';
import { AccountTypeId } from '@coachcare/backend/services';
import { PaginatorComponent } from '@coachcare/common/components';
import { AccountCSVDialogComponent } from '../dialogs';

@Component({
  selector: 'ccr-accounts-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
  providers: [AccountsDataSource]
})
export class AccountsListComponent implements OnInit, OnDestroy {
  accountType: AccountTypeId;
  columns = ['id', 'name', 'email', 'actions'];

  @ViewChild(PaginatorComponent, { static: true })
  paginator: PaginatorComponent;

  constructor(
    private dialog: MatDialog,
    private route: ActivatedRoute,
    public source: AccountsDataSource
  ) {}

  ngOnInit() {
    // route parameters
    this.route.data.subscribe((data: any) => {
      this.accountType = data.accountType;
      this.source.addDefault({
        accountType: this.accountType
      });
    });

    this.source.setPaginator(this.paginator, getterPaginator(this.paginator));
  }

  ngOnDestroy() {
    this.source.unsetPaginator();
  }

  openCSVDialog(): void {
    this.dialog.open(AccountCSVDialogComponent, { width: '60vw' });
  }
}
