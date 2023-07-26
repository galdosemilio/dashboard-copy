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
  DieterListingItem,
  DieterListingOrgItem,
  DieterListingPackageItem,
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
  AccountTypeId,
  MeasurementDataPointMinimalType,
  convertToReadableFormat,
  DataPointTypes,
  Schedule,
  OrganizationAccess,
  NamedEntity
} from '@coachcare/sdk'
import { AccountEditDialog, AccountEditDialogData } from '../../dialogs'
import { DieterListingDatabase, DieterListingDataSource } from '../services'
import { UserMeasurementPreferenceType } from '@coachcare/sdk/dist/lib/providers/user/requests/userMeasurementPreference.type'
import { confirmRemoveAssociatedMeetings } from '@app/dashboard/accounts/dieters/helpers'
import { filter } from 'rxjs/operators'
import { resolveConfig } from '@app/config/section'

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

  extraColumns: NamedEntity[] = []
  measurementPreference: UserMeasurementPreferenceType
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
    private store: Store<UILayoutState>,
    private schedule: Schedule
  ) {}

  ngOnDestroy(): void {
    this.store.dispatch(new OpenPanel())

    this.source.unsetSorter()
  }

  ngOnInit(): void {
    this.measurementPreference = this.context.user.measurementPreference
    this.store.dispatch(new ClosePanel())

    this.source.setSorter(
      this.sort,
      () =>
        ({
          sort: this.sort.direction
            ? [
                {
                  property: this.sort.active || 'firstName',
                  dir: this.sort.direction || 'asc'
                }
              ]
            : [
                {
                  property: 'firstName',
                  dir: 'asc'
                }
              ]
        } as any)
    )

    this.source.addDefault({
      ['type-sort']: DataPointTypes.BLOOD_PRESSURE_SYSTOLIC
    })

    this.context.organization$.pipe(untilDestroyed(this)).subscribe((org) => {
      this.hasAdmin = org && org.permissions ? org.permissions.admin : false
      this.extraColumns =
        resolveConfig(
          'PATIENT_LISTING.ADDITIONAL_LISTING_COLUMNS',
          this.context.organization
        ) ?? []
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

  bloodPressureClasses(
    diastolic?: number,
    systolic?: number
  ): { [key: string]: boolean } {
    const defaultClasses = { 'column-bloodpressure': true }

    if (!diastolic || !systolic) {
      return defaultClasses
    }

    let additionalClass

    if (systolic > 180 || diastolic > 120) {
      additionalClass = 'ccr-blood-pressure-hypertensive-crisis'
    } else if (systolic > 139 || diastolic > 89) {
      additionalClass = 'ccr-blood-pressure-hypertension-stage-2'
    } else if (
      (systolic >= 130 && systolic <= 139) ||
      (diastolic >= 80 && diastolic <= 89)
    ) {
      additionalClass = 'ccr-blood-pressure-hypertension-stage-1'
    } else if (systolic < 90 || diastolic < 60) {
      additionalClass = 'ccr-blood-pressure-hypotensive'
    } else if (systolic >= 120 && systolic <= 129 && diastolic <= 79) {
      additionalClass = 'ccr-blood-pressure-elevated'
    } else if (
      systolic >= 90 &&
      systolic <= 119 &&
      diastolic >= 60 &&
      diastolic <= 79
    ) {
      additionalClass = 'ccr-blood-pressure-normal'
    }

    return additionalClass
      ? { ...defaultClasses, [additionalClass]: true }
      : defaultClasses
  }

  convertToReadableFormat(
    value: number,
    type: MeasurementDataPointMinimalType,
    measurementPreference: UserMeasurementPreferenceType
  ): string {
    return convertToReadableFormat(value, type, measurementPreference).toFixed(
      0
    )
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
      .pipe(filter((user) => user))
      .subscribe(() => {
        this.notify.success(_('NOTIFY.SUCCESS.PATIENT_UPDATED'))
        this.source.refresh()
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
      this.notify.error(error)
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
      this.notify.success(_('NOTIFY.SUCCESS.PATIENT_REMOVED'))
      this.source.refresh()
    } catch (err) {
      this.notify.error(err)
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
        void this.router.navigate(['/accounts/patients', dieter.id])
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
