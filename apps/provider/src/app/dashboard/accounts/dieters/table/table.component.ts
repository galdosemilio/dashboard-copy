import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  HostBinding,
  Input,
  OnDestroy,
  OnInit,
  Output,
  ViewChild
} from '@angular/core'
import { MatDialog, MatSort, Sort } from '@coachcare/common/material'
import { Router } from '@angular/router'
import { untilDestroyed } from 'ngx-take-until-destroy'
import { Affiliation, Organization } from 'selvera-api'

import {
  AccountEditDialog,
  AccountEditDialogData
} from '@app/dashboard/accounts/dialogs/account-edit/account-edit.dialog'
import { ContextService, NotifierService } from '@app/service'
import {
  _,
  AccountRedirectDialog,
  PromptDialog,
  PromptDialogData
} from '@app/shared'
import { AccountAccessData, AccountTypeId } from '@coachcare/npm-api'
import { DietersDataSource } from '../services'

@Component({
  selector: 'app-dieters-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss']
})
export class DietersTableComponent implements OnInit, OnDestroy {
  @Input()
  columns = ['firstName', 'lastName', 'email', 'created', 'actions']
  @Input()
  defaultClickAction = true
  @Input()
  source: DietersDataSource | null
  @Input()
  withSorting = true

  @Input()
  @HostBinding('class.ccr-edit-table')
  editable = false

  @Output()
  onSorted = new EventEmitter<Sort>()
  @Output()
  onSelected = new EventEmitter<AccountAccessData>()

  @ViewChild(MatSort, { static: false })
  sort: MatSort

  canViewAll = true
  canAccessPhi = true
  hasAdmin = false

  constructor(
    private cdr: ChangeDetectorRef,
    private dialog: MatDialog,
    private organization: Organization,
    private affiliation: Affiliation,
    private context: ContextService,
    private notifier: NotifierService,
    private router: Router
  ) {}

  ngOnInit() {
    this.cdr.detectChanges()

    this.context.organization$.pipe(untilDestroyed(this)).subscribe((org) => {
      this.canViewAll = org && org.permissions ? org.permissions.viewAll : false
      this.canAccessPhi =
        org && org.permissions ? org.permissions.allowClientPhi : false
      this.hasAdmin = org && org.permissions ? org.permissions.admin : false
    })
  }

  ngOnDestroy() {}

  onSort(sort: Sort) {
    this.onSorted.emit(sort)
  }

  onEdit(dieter: AccountAccessData) {
    const data: AccountEditDialogData = {
      id: dieter.id,
      firstName: dieter.firstName,
      lastName: dieter.lastName,
      email: dieter.email,
      startedAt: ''
    }
    this.dialog
      .open(AccountEditDialog, {
        data: data,
        width: '80vw',
        panelClass: 'ccr-full-dialog'
      })
      .afterClosed()
      .subscribe((user: AccountEditDialogData) => {
        if (user) {
          this.notifier.success(_('NOTIFY.SUCCESS.PATIENT_UPDATED'))
          // trigger a table refresh
          this.source.refresh()
        }
      })
  }

  showDieter(dieter: AccountAccessData, newTab?: boolean): void {
    this.onSelected.emit(dieter)
    const routeQuery = window.location.href.split('?')[1]
    if (this.defaultClickAction) {
      this.context.account = dieter
      if (newTab) {
        window.open(
          `./accounts/patients/${dieter.id}${
            routeQuery ? '?' + routeQuery : ''
          }`,
          '_blank'
        )
      } else {
        this.router.navigate(['/accounts/patients', dieter.id])
        if (this.canAccessPhi) {
          this.onSelected.emit(dieter)
          if (this.defaultClickAction) {
            this.context.account = dieter
            if (newTab) {
              window.open(
                `./accounts/patients/${dieter.id}${
                  routeQuery ? '?' + routeQuery : ''
                }`,
                '_blank'
              )
            } else {
              this.router.navigate(['/accounts/patients', dieter.id])
            }
          }
        }
      }
    }
  }

  async onRemove(dieter) {
    try {
      const response = await this.organization.getAccessibleList({
        account: dieter.id,
        status: 'active',
        strict: true,
        limit: 2
      })

      const hasDiffClinic = response.data.find(
        (access) => access.organization.id !== this.context.organizationId
      )

      if (hasDiffClinic) {
        this.dialog.open(AccountRedirectDialog, {
          data: {
            account: dieter,
            accountType: AccountTypeId.Client
          },
          width: '60vw'
        })
      } else {
        const data: PromptDialogData = {
          title: _('BOARD.PATIENT_REMOVE'),
          content: _('BOARD.PATIENT_REMOVE_PROMPT'),
          contentParams: { patient: `${dieter.firstName} ${dieter.lastName}` }
        }
        this.dialog
          .open(PromptDialog, { data: data })
          .afterClosed()
          .subscribe((confirm) => {
            if (confirm) {
              this.affiliation
                .disassociate({
                  account: dieter.id,
                  organization: this.source.args.organization
                })
                .then(() => {
                  this.notifier.success(_('NOTIFY.SUCCESS.PATIENT_REMOVED'))
                  // trigger a table refresh
                  this.source.refresh()
                })
                .catch((err) => this.notifier.error(err))
            }
          })
      }
    } catch (error) {
      this.notifier.error(error)
    }
  }
}
