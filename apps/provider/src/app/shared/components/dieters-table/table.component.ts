import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  HostBinding,
  Input,
  OnInit,
  Output,
  ViewChild
} from '@angular/core'
import { MatDialog, MatSort, Sort } from '@coachcare/material'
import { Router } from '@angular/router'
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy'
import {
  AccountAccessData,
  AccountTypeId,
  Affiliation,
  OrganizationAccess,
  OrganizationProvider,
  Schedule
} from '@coachcare/sdk'

import {
  AccountEditDialog,
  AccountEditDialogData
} from '@app/dashboard/accounts/dialogs/account-edit/account-edit.dialog'
import {
  ContextService,
  DietersDataSource,
  NotifierService
} from '@app/service'
import {
  _,
  AccountRedirectDialog,
  DieterListingItem,
  PromptDialog,
  PromptDialogData
} from '@app/shared'
import { confirmRemoveAssociatedMeetings } from '@app/dashboard/accounts/dieters/helpers'
import { filter } from 'rxjs/operators'

@UntilDestroy()
@Component({
  selector: 'ccr-dieters-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss']
})
export class CcrDietersTableComponent implements OnInit {
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
    private organization: OrganizationProvider,
    private affiliation: Affiliation,
    private context: ContextService,
    private notifier: NotifierService,
    private router: Router,
    private schedule: Schedule
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
      .pipe(filter((user) => user))
      .subscribe(() => {
        this.notifier.success(_('NOTIFY.SUCCESS.PATIENT_UPDATED'))
        // trigger a table refresh
        this.source.refresh()
      })
  }

  showDieter(dieter: AccountAccessData, newTab?: boolean): void {
    this.onSelected.emit(dieter)
    const routeQuery = window.location.href.split('?')[1]

    if (!this.defaultClickAction) {
      return
    }

    this.context.account = dieter

    if (newTab) {
      window.open(
        `./accounts/patients/${dieter.id}${routeQuery ? '?' + routeQuery : ''}`,
        '_blank'
      )
    } else {
      if (this.canAccessPhi) {
        this.onSelected.emit(dieter)
        this.context.account = dieter
      }

      void this.router.navigate(['/accounts/patients', dieter.id])
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

      const organizations = response.data

      const hasDiffClinic = organizations.find(
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
          .pipe(filter((confirm) => confirm))
          .subscribe(() => this.deletePatient(dieter, organizations))
      }
    } catch (error) {
      this.notifier.error(error)
    }
  }

  private async deletePatient(
    dieter: DieterListingItem,
    organizations: Array<OrganizationAccess>
  ): Promise<void> {
    try {
      const confirmed = await confirmRemoveAssociatedMeetings({
        account: dieter,
        dialog: this.dialog,
        organizationId: this.source.args.organization,
        organizations,
        schedule: this.schedule
      })

      if (!confirmed) {
        return
      }

      await this.affiliation.disassociate({
        account: dieter.id,
        organization: this.source.args.organization
      })
      this.notifier.success(_('NOTIFY.SUCCESS.PATIENT_REMOVED'))
      this.source.refresh()
    } catch (err) {
      this.notifier.error(err)
    }
  }
}
