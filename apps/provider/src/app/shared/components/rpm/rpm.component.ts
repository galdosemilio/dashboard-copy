import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  OnInit,
  Output,
  ViewChild,
  ViewEncapsulation
} from '@angular/core'
import { MatDialog, MatSlideToggle } from '@coachcare/material'
import { ContextService } from '@app/service'
import { RPMStatusDialog } from '@app/shared/dialogs'
import {
  AccountProvider,
  AccSingleResponse,
  OrganizationProvider,
  OrganizationAccess,
  RPM
} from '@coachcare/sdk'
import { _ } from '@app/shared/utils'
import { sortBy, uniqBy } from 'lodash'
import * as moment from 'moment'
import { RPMStateEntry, RPMStateTypes } from './models'

@Component({
  selector: 'app-rpm',
  templateUrl: './rpm.component.html',
  styleUrls: ['./rpm.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class RPMComponent implements AfterViewInit, OnInit {
  @Output() rpmStatusChange: EventEmitter<void> = new EventEmitter<void>()

  @ViewChild(MatSlideToggle, { static: false }) toggle: MatSlideToggle

  accessibleOrganizations: OrganizationAccess[] = []
  inaccessibleOrganizations: OrganizationAccess[] = []
  mostRecentEdition: RPMStateEntry
  mostRecentEntry: RPMStateEntry
  isLoading = false
  rpmEntries: RPMStateEntry[] = []

  constructor(
    private account: AccountProvider,
    private cdr: ChangeDetectorRef,
    private context: ContextService,
    private dialog: MatDialog,
    private organization: OrganizationProvider,
    private rpm: RPM
  ) {}

  ngAfterViewInit() {
    this.toggle.defaults = {
      disableToggleValue: true
    }
  }

  async ngOnInit() {
    this.refresh()
  }

  openStatusDialog() {
    this.dialog
      .open(RPMStatusDialog, {
        data: {
          accessibleOrganizations: this.accessibleOrganizations,
          inaccessibleOrganizations: this.inaccessibleOrganizations,
          mostRecentEntry:
            this.mostRecentEntry.rpmState.status !== RPMStateTypes.neverActive
              ? this.mostRecentEntry
              : undefined
        },
        width: '60vw'
      })
      .afterClosed()
      .subscribe((closingState) => {
        if (
          closingState === 'new_entry' ||
          closingState === 'remove_entry' ||
          closingState === true
        ) {
          this.rpmStatusChange.emit()
          this.refresh()
        }
      })
  }

  private async refresh() {
    try {
      this.isLoading = true
      const accessibleOrgs = (
        await this.organization.getAccessibleList({
          account: this.context.accountId,
          limit: 'all',
          offset: 0
        })
      ).data

      const promises = []

      accessibleOrgs.forEach((org) =>
        promises.push(
          this.rpm.getList({
            account: this.context.accountId,
            organization: org.organization.id,
            limit: 'all',
            offset: 0
          })
        )
      )

      const responses = await Promise.all(promises)
      let allEntries = []

      responses.forEach((response) => {
        response.data.forEach((entry) => {
          allEntries.push(entry)
        })
      })

      allEntries = uniqBy(allEntries, 'id')
      this.mostRecentEntry = new RPMStateEntry({
        rpmState: sortBy(allEntries, (entry) => moment(entry.createdAt)).pop()
      })

      if (this.mostRecentEntry.rpmState.createdBy) {
        this.mostRecentEntry.rpmState.createdBy = await this.resolveCreatedByAccount(
          this.mostRecentEntry.rpmState.createdBy.id
        )
      }

      const permissionPromises = accessibleOrgs.map((org) =>
        this.resolveOrgPermissions(org)
      )
      const restrictionPromises = accessibleOrgs.map((org) =>
        this.resolveOrgPermissions(org, false)
      )

      const permissions = (await Promise.all(permissionPromises)).filter(
        (org) => !!org
      )
      const restrictions = (await Promise.all(restrictionPromises)).filter(
        (org) => !!org
      )

      this.accessibleOrganizations = permissions
      this.inaccessibleOrganizations = restrictions

      this.isLoading = false
      this.cdr.detectChanges()
    } catch (error) {
      this.isLoading = false
    }
  }

  private async resolveCreatedByAccount(
    id: string
  ): Promise<AccSingleResponse> {
    try {
      return await this.account.getSingle(id)
    } catch (error) {
      return {
        id: '',
        accountType: undefined,
        firstName: _('BOARD.INACCESSIBLE_PROVIDER'),
        lastName: '',
        email: '',
        preferredLocales: [],
        preference: {},
        createdAt: '',
        isActive: true,
        measurementPreference: 'metric',
        timezone: '',
        phone: '',
        countryCode: '',
        phoneType: 'ios'
      }
    }
  }

  private async resolveOrgPermissions(
    organization,
    positivePermission: boolean = true
  ) {
    return (await this.context.orgHasPerm(
      organization.organization.id,
      'admin',
      false
    ))
      ? positivePermission
        ? organization
        : undefined
      : positivePermission
      ? undefined
      : organization
  }
}
