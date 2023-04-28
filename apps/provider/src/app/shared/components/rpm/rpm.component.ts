import {
  ChangeDetectorRef,
  Component,
  OnInit,
  ViewEncapsulation
} from '@angular/core'
import { MatDialog } from '@coachcare/material'
import {
  ContextService,
  NotifierService,
  SelectedOrganization
} from '@app/service'
import { RPMStatusDialog } from '@app/shared/dialogs'
import {
  AccountProvider,
  AccSingleResponse,
  OrganizationProvider,
  OrganizationAccess,
  CareManagementState,
  CareManagementStateEntity
} from '@coachcare/sdk'
import { SelectOption, _ } from '@app/shared/utils'
import { flatMap, sortBy, uniqBy } from 'lodash'
import * as moment from 'moment'
import { RPMStateEntry } from './models'
import { debounceTime, filter } from 'rxjs/operators'
import { FormBuilder, FormGroup } from '@angular/forms'
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy'
import { STORAGE_CARE_MANAGEMENT_SERVICE_TYPE } from '@app/config'

@UntilDestroy()
@Component({
  selector: 'app-rpm',
  templateUrl: './rpm.component.html',
  styleUrls: ['./rpm.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class RPMComponent implements OnInit {
  form: FormGroup
  accessibleOrganizations: OrganizationAccess[] = []
  inaccessibleOrganizations: OrganizationAccess[] = []
  mostRecentEntry: RPMStateEntry
  activeCareManagmeentSessions: CareManagementStateEntity[] = []
  isLoading = false
  rpmEntries: RPMStateEntry[] = []
  serviceType: string
  serviceTypes: SelectOption<string>[] = []
  activeCareEntries: RPMStateEntry[] = []

  constructor(
    private account: AccountProvider,
    private cdr: ChangeDetectorRef,
    private context: ContextService,
    private dialog: MatDialog,
    private notifier: NotifierService,
    private builder: FormBuilder,
    private organization: OrganizationProvider,
    private careManagementState: CareManagementState
  ) {}

  async ngOnInit() {
    this.createForm()

    this.context.organization$
      .pipe(untilDestroyed(this))
      .subscribe((organization) => {
        void this.resolveServiceTypes(organization)
      })

    this.form.controls.serviceType.valueChanges
      .pipe(untilDestroyed(this), debounceTime(300))
      .subscribe(() => {
        this.serviceType = this.form.value.serviceType
        this.context.activeCareManagementService =
          this.context.accessibleCareManagementServiceTypes.find(
            (entity) => entity.id === this.serviceType
          )
        localStorage.setItem(
          STORAGE_CARE_MANAGEMENT_SERVICE_TYPE,
          this.serviceType
        )
      })
  }

  private createForm() {
    this.form = this.builder.group({
      serviceType: []
    })
  }

  private async resolveServiceTypes(organization: SelectedOrganization) {
    this.isLoading = true

    try {
      // Populate appropriate service types into the dropdown

      // populate listing of active care management sessions for patient
      const activeCareManagementSessions = (
        await this.careManagementState.getList({
          account: this.context.accountId,
          organization: this.context.organization.id,
          status: 'active'
        })
      ).data

      // filter by listing of care management service types accessible to authenticated provider
      const accessibleAndActiveServiceTypes =
        this.context.accessibleCareManagementServiceTypes
          .filter((accessibleServiceType) => {
            return activeCareManagementSessions.some(
              (activeSession) =>
                activeSession.serviceType.id === accessibleServiceType.id
            )
          })
          .map((e) => {
            return {
              value: e.id,
              viewValue: e.name
            }
          })

      // Show either listing of active and accessible care management sessions, or select "No Program"

      this.serviceTypes = accessibleAndActiveServiceTypes.length
        ? accessibleAndActiveServiceTypes
        : [
            {
              value: '',
              viewValue: _('GLOBAL.NO_PROGRAM')
            }
          ]

      const storageServiceType = localStorage.getItem(
        STORAGE_CARE_MANAGEMENT_SERVICE_TYPE
      )

      // If the saved service type matches an active session - use that, else - take first option from listing
      const loadedServiceType = accessibleAndActiveServiceTypes.find(
        (e) => e.value === storageServiceType
      )
        ? storageServiceType
        : this.serviceTypes[0].value

      this.form.patchValue({
        serviceType: loadedServiceType
      })

      localStorage.setItem(
        STORAGE_CARE_MANAGEMENT_SERVICE_TYPE,
        loadedServiceType
      )
    } catch (error) {
      this.notifier.error(error)
    } finally {
      this.isLoading = false
    }
  }

  async openStatusDialog() {
    if (this.isLoading) {
      return
    }

    await this.refresh()

    this.dialog
      .open(RPMStatusDialog, {
        data: {
          accessibleOrganizations: this.accessibleOrganizations,
          inaccessibleOrganizations: this.inaccessibleOrganizations,
          careEntries: this.rpmEntries,
          activeCareEntries: this.activeCareEntries
        },
        width: '60vw'
      })
      .afterClosed()
      .pipe(filter((changed) => changed === true))
      .subscribe(() => {
        void this.resolveServiceTypes(this.context.organization)
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

      const accessibleCareServices =
        this.context.accessibleCareManagementServiceTypes.slice()

      const promises = flatMap(
        accessibleCareServices.map((careService) =>
          accessibleOrgs.map((org) =>
            this.careManagementState.getList({
              account: this.context.accountId,
              organization: org.organization.id,
              serviceType: careService.id,
              limit: 'all',
              offset: 0
            })
          )
        )
      )

      const responses = await Promise.all(promises)
      let allEntries = flatMap(responses.map((response) => [...response.data]))

      allEntries = uniqBy(allEntries, 'id')
      this.rpmEntries = allEntries
        .slice()
        .map((entry) => new RPMStateEntry({ rpmState: entry }))
      this.activeCareEntries = this.rpmEntries.filter((entry) => entry.isActive)
      this.mostRecentEntry = new RPMStateEntry({
        rpmState: sortBy(allEntries, (entry) => moment(entry.createdAt)).pop()
      })

      if (this.mostRecentEntry.rpmState.createdBy) {
        this.mostRecentEntry.rpmState.createdBy =
          await this.resolveCreatedByAccount(
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
      console.error(error)
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
