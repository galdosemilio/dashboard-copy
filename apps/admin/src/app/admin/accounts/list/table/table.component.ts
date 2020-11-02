import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnDestroy,
  OnInit,
  ViewChild
} from '@angular/core'
import { MatSort } from '@coachcare/common/material'
import { ActivatedRoute, Router } from '@angular/router'
import { AccountDialogs, AccountRoutes } from '@board/services'
import { AccountsDatabase, AccountsDataSource } from '@coachcare/backend/data'
import { getterSorter } from '@coachcare/backend/model'
import { AccountFullData, AccountTypeId } from '@coachcare/npm-api'
import { _ } from '@coachcare/backend/shared'
import { NotifierService } from '@coachcare/common/services'

@Component({
  selector: 'ccr-accounts-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AccountsTableComponent implements OnInit, OnDestroy {
  @Input() columns = []
  @Input() source: AccountsDataSource

  @ViewChild(MatSort, { static: false })
  sort: MatSort

  constructor(
    protected router: Router,
    protected route: ActivatedRoute,
    protected notifier: NotifierService,
    protected database: AccountsDatabase,
    protected dialogs: AccountDialogs,
    public routes: AccountRoutes
  ) {}

  ngOnInit() {
    this.source.setSorter(this.sort, getterSorter(this.sort))
  }

  ngOnDestroy() {
    this.source.unsetSorter()
  }

  onDisplay(row: AccountFullData) {
    this.router.navigate([
      this.routes.single(row.accountType.id as AccountTypeId, row.id)
    ])
  }

  onEdit(row: AccountFullData) {
    this.router.navigate([
      this.routes.edit(row.accountType.id as AccountTypeId, row.id)
    ])
  }

  onActivate(row: AccountFullData) {
    this.dialogs
      .activatePrompt(row)
      .then(() => {
        row.isActive = true
        this.notifier.success(_('NOTIFY.SUCCESS.ACC_ACTIVATED'))
      })
      .catch((err) => {
        if (err) {
          // non-discarded prompt
          this.notifier.error(err)
        }
      })
  }

  onDeactivate(row: AccountFullData) {
    this.dialogs
      .deactivatePrompt(row)
      .then(() => {
        row.isActive = false
        this.notifier.success(_('NOTIFY.SUCCESS.ACC_DEACTIVATED'))
      })
      .catch((err) => {
        if (err) {
          // non-discarded prompt
          this.notifier.error(err)
        }
      })
  }
}
