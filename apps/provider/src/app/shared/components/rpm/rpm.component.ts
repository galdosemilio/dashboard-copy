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
  OrganizationAccess,
  CareManagementState,
  CareManagementStateEntity
} from '@coachcare/sdk'
import { SelectOption, _ } from '@app/shared/utils'
import { RPMStateEntry } from './models'
import { debounceTime, filter } from 'rxjs/operators'
import { FormBuilder, FormGroup } from '@angular/forms'
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy'
import { STORAGE_ACTIVE_CARE_MANAGEMENT_SERVICE_TYPE } from '@app/config'
import { CareManagementPermissionsService } from '@app/service/care-management-permissions.service'

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
    private cdr: ChangeDetectorRef,
    private context: ContextService,
    private dialog: MatDialog,
    private notifier: NotifierService,
    private builder: FormBuilder,
    private careManagementState: CareManagementState,
    private careManagementPermissions: CareManagementPermissionsService
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
          STORAGE_ACTIVE_CARE_MANAGEMENT_SERVICE_TYPE,
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
        STORAGE_ACTIVE_CARE_MANAGEMENT_SERVICE_TYPE
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
        STORAGE_ACTIVE_CARE_MANAGEMENT_SERVICE_TYPE,
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
      .pipe(filter(({ isChangedCareEntries }) => isChangedCareEntries === true))
      .subscribe(() => {
        void this.resolveServiceTypes(this.context.organization)
      })
  }

  private async refresh() {
    try {
      this.isLoading = true
      await this.careManagementPermissions.init(this.context.accountId)
      this.rpmEntries = this.careManagementPermissions.careEntries

      this.activeCareEntries = this.careManagementPermissions.activeCareEntries

      this.accessibleOrganizations = this.careManagementPermissions.permissions
      this.inaccessibleOrganizations =
        this.careManagementPermissions.restrictions

      this.isLoading = false
      this.cdr.detectChanges()
    } catch (error) {
      console.error(error)
      this.isLoading = false
    }
  }
}
