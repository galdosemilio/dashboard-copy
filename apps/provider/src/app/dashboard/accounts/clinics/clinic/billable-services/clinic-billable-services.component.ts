import { Component, OnInit, ViewEncapsulation } from '@angular/core'
import { ContextService, NotifierService } from '@app/service'
import {
  CareManagementOrganizationPreference,
  CareManagementPreference,
  CareManagementServiceTypeId,
  CareManagementState,
  NamedEntity,
  OrganizationProvider
} from '@coachcare/sdk'
import { _ } from '@app/shared/utils'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy'
import { debounceTime, filter, tap } from 'rxjs/operators'
import { MatDialog } from '@angular/material/dialog'
import { AddSupervisingProviderDialog } from '../../dialogs'
import {
  PromptDialog,
  SupervisingProvidersDatabase,
  SupervisingProvidersDataSource
} from '@app/shared'
import { DeviceDetectorService } from 'ngx-device-detector'

@UntilDestroy()
@Component({
  selector: 'app-clinic-billable-services',
  templateUrl: './clinic-billable-services.component.html',
  styleUrls: ['./clinic-billable-services.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ClinicBillableServicesComponent implements OnInit {
  public colSpan = 2
  public form: FormGroup
  public isAdmin = false
  public prefClinic: NamedEntity = { name: 'Test Name', id: '1' }
  public isInherited = true
  public rpmPref?: CareManagementOrganizationPreference
  public source: SupervisingProvidersDataSource

  private rpmPrefUpdateBlock = true

  constructor(
    private careManagementState: CareManagementState,
    private carePreference: CareManagementPreference,
    private context: ContextService,
    private database: SupervisingProvidersDatabase,
    private deviceDetector: DeviceDetectorService,
    private dialog: MatDialog,
    private fb: FormBuilder,
    private notifier: NotifierService,
    private organization: OrganizationProvider
  ) {}

  public ngOnInit(): void {
    this.createForm()
    this.createSource()
    void this.resolveRPMPreference()
    void this.resolveAdminStatus()
  }

  public isTinValid(): boolean {
    return this.form.get('tin').valid
  }

  public showAddProviderDialog(): void {
    this.dialog
      .open(AddSupervisingProviderDialog, {
        data: { clinic: this.prefClinic }
      })
      .afterClosed()
      .pipe(filter((account) => account))
      .subscribe((account) => {
        void this.addSupervisingProvider(account)
      })
  }

  public showClearTinDialog(): void {
    if (this.isInherited) {
      this.dialog
        .open(PromptDialog, {
          data: {
            title: _('BOARD.CLINIC_REMOVE_INHERITED_TIN'),
            content: _('BOARD.CLINIC_REMOVE_INHERITED_TIN_DESCRIPTION'),
            contentParams: this.prefClinic,
            yes: _('GLOBAL.REMOVE')
          }
        })
        .afterClosed()
        .pipe(filter((confirm) => confirm))
        .subscribe(() => {
          this.rpmPrefUpdateBlock = true
          this.form.patchValue({
            tin: '',
            deviceSetupNotification: true
          })
          this.rpmPrefUpdateBlock = false
          void this.syncPreference()
        })
    } else {
      this.dialog
        .open(PromptDialog, {
          data: {
            title: _('BOARD.CLINIC_REMOVE_TIN'),
            content: _('BOARD.CLINIC_REMOVE_TIN_DESCRIPTION'),
            yes: _('GLOBAL.REMOVE')
          }
        })
        .afterClosed()
        .pipe(filter((confirm) => confirm))
        .subscribe(() => {
          void this.removeRPMPreference()
        })
    }
  }

  public showProviderInheritanceDialog(): void {
    if (!this.isAdmin) {
      return
    }

    this.dialog
      .open(PromptDialog, {
        data: {
          title: _('BOARD.CLINIC_REMOVE_INHERITED_SUP_PROVIDERS'),
          content: _('BOARD.CLINIC_REMOVE_INHERITED_SUP_PROV_DESC'),
          contentParams: this.source.inheritedClinic,
          yes: _('GLOBAL.REMOVE')
        },
        width: this.deviceDetector.isMobile ? undefined : '60vw'
      })
      .afterClosed()
      .pipe(filter((confirm) => confirm))
      .subscribe(() => {
        this.source.forceEmpty = true
        this.source.removeInheritance()
      })
  }

  private async addSupervisingProvider(account): Promise<void> {
    try {
      await this.careManagementState.addSupervisingProvider({
        account: account.id,
        organization: this.context.clinic.id
      })
      this.notifier.success(_('NOTIFY.SUCCESS.SUPERVISING_PROVIDER_ADDED'))
      this.rpmPrefUpdateBlock = true
      void this.resolveRPMPreference()
      this.source.forceEmpty = false
      this.source.refresh()
    } catch (error) {
      this.notifier.error(error)
    }
  }

  private createForm(): void {
    this.form = this.fb.group({
      tin: ['', Validators.required],
      deviceSetupNotification: [null],
      isInherited: [false]
    })

    this.form.controls.tin.valueChanges
      .pipe(
        tap(() => {
          this.form.updateValueAndValidity()
        }),
        filter(() => !this.rpmPrefUpdateBlock && !this.form.invalid),
        debounceTime(200),
        untilDestroyed(this)
      )
      .subscribe(() => void this.syncPreference())

    this.form.controls.deviceSetupNotification.valueChanges
      .pipe(
        filter(() => !this.rpmPrefUpdateBlock),
        debounceTime(200),
        untilDestroyed(this)
      )
      .subscribe(() => void this.syncPreference())

    this.form.controls.isInherited.valueChanges
      .pipe(
        filter(() => !this.rpmPrefUpdateBlock),
        debounceTime(200),
        untilDestroyed(this)
      )
      .subscribe(async (isInherited) => {
        if (isInherited) {
          this.showInheritPromptDialog()
        } else {
          await this.carePreference.createCareManagementPreference({
            organization: this.context.clinic.id,
            isActive: true,
            serviceType: CareManagementServiceTypeId.RPM
          })

          this.rpmPrefUpdateBlock = true
          void this.resolveRPMPreference()
        }
      })
  }

  private createSource(): void {
    this.source = new SupervisingProvidersDataSource(this.database)
    this.source.addDefault({ organization: this.context.clinic.id })
  }

  private async removeRPMPreference(): Promise<void> {
    try {
      this.rpmPrefUpdateBlock = true
      await this.carePreference.deleteCareManagementPreference(this.rpmPref.id)
      this.notifier.success(_('NOTIFY.SUCCESS.RPM_PREF_REMOVED'))
      await this.resolveRPMPreference()
      this.rpmPrefUpdateBlock = false
    } catch (error) {
      this.notifier.error(error)
    }
  }

  private async resolveAdminStatus(): Promise<void> {
    try {
      this.isAdmin = await this.context.orgHasPerm(
        this.context.clinic.id,
        'admin'
      )
    } catch (error) {
      this.notifier.error(error)
    }
  }

  private async resolveRPMPreference(): Promise<void> {
    try {
      const res = await this.carePreference.getAllCareManagementPreferences({
        organization: this.context.clinic.id,
        serviceType: CareManagementServiceTypeId.RPM
      })

      this.rpmPref = res.data[0]

      await this.resolvePrefProps(this.rpmPref)

      this.form.patchValue(
        {
          tin: this.rpmPref?.taxIdentificationNumber ?? '',
          deviceSetupNotification:
            this.rpmPref?.deviceSetupNotification === 'enabled',
          isInherited: this.isInherited
        },
        { emitEvent: false }
      )

      this.rpmPrefUpdateBlock = false
    } catch (error) {
      this.rpmPref = null
      this.form.patchValue(
        { tin: '', deviceSetupNotification: true, isInherited: false },
        { emitEvent: false }
      )
      this.rpmPrefUpdateBlock = false
      this.isInherited = false
      console.warn(error)
    }
  }

  private async resolvePrefProps(
    pref: CareManagementOrganizationPreference
  ): Promise<void> {
    try {
      this.isInherited = pref.organization.id !== this.context.clinic.id
      this.prefClinic = await this.organization.getSingle(pref.organization.id)
    } catch (error) {
      this.notifier.error(error)
    }
  }

  private showInheritPromptDialog(): void {
    this.dialog
      .open(PromptDialog, {
        data: {
          title: 'Inherit Settings',
          content:
            'Are you sure you want to inherit the Billable Service Settings from a parent clinic? <strong>This will override all the billable service settings your clinic could have.</strong>'
        }
      })
      .afterClosed()
      .subscribe(async (confirm) => {
        this.rpmPrefUpdateBlock = true
        if (!confirm) {
          this.form.patchValue({ isInherited: false }, { emitEvent: false })
          this.rpmPrefUpdateBlock = false
          return
        }

        await this.carePreference.deleteCareManagementPreference(
          this.rpmPref.id
        )
        void this.resolveRPMPreference()
      })
  }

  private async syncPreference(): Promise<void> {
    try {
      const formValue = this.form.value

      const taxIdentificationNumber = this.isTinValid()
        ? formValue.tin
        : undefined
      const deviceSetupNotification =
        formValue.deviceSetupNotification === true ? 'enabled' : 'disabled'

      let entity
      if (!this.rpmPref || this.isInherited) {
        entity = await this.carePreference.createCareManagementPreference({
          organization: this.context.clinic.id,
          isActive: true,
          serviceType: CareManagementServiceTypeId.RPM,
          taxIdentificationNumber,
          deviceSetupNotification
        })
      } else {
        await this.carePreference.updateCareManagementPreference({
          id: this.rpmPref.id,
          isActive: this.rpmPref.isActive,
          taxIdentificationNumber,
          deviceSetupNotification
        })
      }

      this.rpmPref =
        await this.carePreference.getCareManagementPreferenceSingle(
          entity?.id ?? this.rpmPref.id
        )

      await this.resolvePrefProps(this.rpmPref)

      this.notifier.success(_('NOTIFY.SUCCESS.RPM_PREF_UPDATED'))
    } catch (error) {
      this.notifier.error(error)
    }
  }
}
