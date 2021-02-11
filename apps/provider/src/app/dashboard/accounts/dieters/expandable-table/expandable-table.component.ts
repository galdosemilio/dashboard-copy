import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  ViewChild,
  ViewEncapsulation
} from '@angular/core'
import { MatDialog } from '@coachcare/material'
import { Router } from '@angular/router'
import { ClosePanel, OpenPanel, UILayoutState } from '@app/layout/store'
import { ContextService, NotifierService } from '@app/service'
import {
  AccountRedirectDialog,
  CcrTableSortDirective,
  PromptDialog,
  PromptDialogData
} from '@app/shared'
import { _ } from '@app/shared/utils'
import { Store } from '@ngrx/store'
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy'
import {
  AccountProvider,
  Affiliation,
  OrganizationProvider,
  AccountTypeId
} from '@coachcare/npm-api'
import { AccountEditDialog, AccountEditDialogData } from '../../dialogs'
import {
  DieterListingItem,
  DieterListingOrgItem,
  DieterListingPackageItem
} from '../models'
import { DieterListingDatabase, DieterListingDataSource } from '../services'

@UntilDestroy()
@Component({
  selector: 'app-dieters-expandable-table',
  templateUrl: './expandable-table.component.html',
  styleUrls: ['./expandable-table.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class DietersExpandableTableComponent implements OnDestroy, OnInit {
  @Input() source: DieterListingDataSource

  @Output() sorted: EventEmitter<void> = new EventEmitter<void>()

  @ViewChild(CcrTableSortDirective, { static: true })
  sort: CcrTableSortDirective

  rows: any
  hasAdmin = false

  constructor(
    private account: AccountProvider,
    private affiliation: Affiliation,
    private cdr: ChangeDetectorRef,
    private context: ContextService,
    private database: DieterListingDatabase,
    private dialog: MatDialog,
    private notify: NotifierService,
    private organization: OrganizationProvider,
    private router: Router,
    private store: Store<UILayoutState>
  ) {}

  ngOnDestroy(): void {
    this.store.dispatch(new OpenPanel())

    this.source.unsetSorter()
  }

  ngOnInit(): void {
    this.store.dispatch(new ClosePanel())

    this.source.setSorter(
      this.sort,
      () =>
        ({
          sort: [
            {
              property: this.sort.active || 'firstName',
              dir: this.sort.direction || 'asc'
            }
          ]
        } as any)
    )

    this.context.organization$.pipe(untilDestroyed(this)).subscribe((org) => {
      this.hasAdmin = org && org.permissions ? org.permissions.admin : false
    })

    this.sort.sortChange.pipe(untilDestroyed(this)).subscribe(() => {
      this.sorted.emit()
      this.source.resetPaginator()
    })

    this.source
      .connect()
      .pipe(untilDestroyed(this))
      .subscribe((value) => {
        this.rows = []
        this.cdr.detectChanges()
        this.rows = value
        this.cdr.detectChanges()
      })
  }

  onEdit(dieter: DieterListingItem) {
    const data: AccountEditDialogData = {
      id: dieter.id,
      firstName: dieter.firstName,
      lastName: dieter.lastName,
      email: dieter.email,
      startedAt: dieter.startedAt
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
          this.notify.success(_('NOTIFY.SUCCESS.PATIENT_UPDATED'))
          this.source.refresh()
        }
      })
  }

  async onLoadMore(
    args: { name: string; row: DieterListingItem },
    index: number
  ) {
    const type = args.name
    const dieter: DieterListingItem = args.row

    const account = this.rows.find(
      (row: any) => row.id && row.id === dieter.id
    ) as DieterListingItem
    if (type === 'load-more-orgs') {
      const orgs = (
        await this.database.fetchMoreOrgs({
          account: dieter.id,
          organization: this.context.organizationId || ''
        })
      ).data.map(
        (org) =>
          new DieterListingOrgItem({
            ...org,
            level: 2,
            isEmpty: false,
            isExpanded: true,
            isHidden: false
          })
      )

      const effectiveOrgs = orgs.filter(
        (org) => !account.organizations.find((o) => o.id === org.id)
      )

      if (effectiveOrgs.length) {
        if (account.organizations && account.organizations.length) {
          account.organizations[
            account.organizations.length - 1
          ].isLastOfGroup = false
        }
        effectiveOrgs[effectiveOrgs.length - 1].isLastOfGroup = true
      }

      const updatedRows = this.rows.slice()

      updatedRows.splice(index, 1)
      updatedRows.splice(index, 0, ...effectiveOrgs)

      account.organizations.pop()
      account.organizations.push(...effectiveOrgs)

      this.rows = updatedRows
      this.cdr.detectChanges()
    } else {
      const packages = (
        await this.database.fetchMorePackages({
          account: dieter.id,
          organization: this.context.organizationId || ''
        })
      ).data.map(
        (pkg) =>
          new DieterListingPackageItem({
            ...pkg,
            level: 2,
            isEmpty: false,
            isExpanded: true,
            isHidden: false
          })
      )

      const effectivePkgs = packages.filter(
        (pkg) => !account.packages.find((p) => p.id === pkg.id)
      )

      if (effectivePkgs.length) {
        if (account.packages && account.packages.length) {
          account.packages[account.packages.length - 1].isLastOfGroup = false
        }
        effectivePkgs[effectivePkgs.length - 1].isLastOfGroup = true
      }

      const updatedRows = this.rows.slice()

      updatedRows.splice(index, 1)
      updatedRows.splice(index, 0, ...effectivePkgs)

      account.packages.pop()
      account.packages.push(...effectivePkgs)

      this.rows = updatedRows
      this.cdr.detectChanges()
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
                  this.notify.success(_('NOTIFY.SUCCESS.PATIENT_REMOVED'))
                  // trigger a table refresh
                  this.source.refresh()
                })
                .catch((err) => this.notify.error(err))
            }
          })
      }
    } catch (error) {
      this.notify.error(error)
    }
  }

  async showDieter(dieter: DieterListingItem, newTab?: boolean) {
    try {
      if (dieter.level !== 0) {
        return
      }
      this.source.isLoading = true
      this.source.change$.next()
      const acc = (await this.account.getList({ query: dieter.email }))[0]

      this.context.account = acc
      if (newTab) {
        window.open(
          `${window.location.href.split('?')[0]}/${dieter.id}`,
          '_blank'
        )
      } else {
        this.router.navigate(['/accounts/patients', dieter.id])
      }
    } catch (error) {
      this.notify.error(error)
    } finally {
      this.source.isLoading = false
      this.source.change$.next()
    }
  }

  toggleRow(dieter: DieterListingItem): void {
    if (dieter.level !== 0) {
      return
    }

    dieter.isExpanded = !dieter.isExpanded
    dieter.organizations.forEach((org) => {
      org.isExpanded = !org.isExpanded
      org.isHidden = !org.isHidden
    })
    dieter.packages.forEach((pkg) => {
      pkg.isExpanded = !pkg.isExpanded
      pkg.isHidden = !pkg.isHidden
    })
  }
}
