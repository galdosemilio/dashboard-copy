import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { MAT_DIALOG_DATA, MatDialogRef } from '@coachcare/material'
import { ContextService, NotifierService } from '@app/service'
import { RPMStateEntry } from '@app/shared/components/rpm/models'
import {
  AccountAccessData,
  OrganizationAccess,
  RPMReason
} from '@coachcare/npm-api'
import { _ } from '@app/shared/utils'
import { RPM } from '@coachcare/npm-api'
import { resolveConfig } from '@app/config/section'
import { RPM_DEVICES } from '@app/dashboard/reports/rpm/models'
import { ImageOptionSelectorItem } from '@app/shared/components/image-option-selector'
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy'

export interface RPMStatusDialogData {
  accessibleOrganizations: OrganizationAccess[]
  inaccessibleOrganizations: OrganizationAccess[]
  mostRecentEntry: RPMStateEntry
}

type DialogStatus = 'no_entry' | 'has_entry' | 'new_entry' | 'about'

@UntilDestroy()
@Component({
  selector: 'app-dialog-rpm-status',
  templateUrl: './rpm-status.dialog.html',
  styleUrls: ['./rpm-status.dialog.scss'],
  host: { class: 'ccr-dialog' },
  encapsulation: ViewEncapsulation.None
})
export class RPMStatusDialog implements OnInit {
  accessibleOrganizations: OrganizationAccess[] = []
  allowNoDeviceOption = false
  canDisableRPM = false
  client: AccountAccessData
  deactivationReasons: RPMReason[] = []
  deactivateRpmForm: FormGroup
  entryIsActive = false
  form: FormGroup
  inaccessibleOrganizations: OrganizationAccess[] = []
  rpmDevices: ImageOptionSelectorItem[] = []
  rpmEntry: RPMStateEntry
  status: DialogStatus = 'no_entry'
  statusCache: DialogStatus
  requiresDeactivationNote = false

  constructor(
    private context: ContextService,
    @Inject(MAT_DIALOG_DATA) public data: RPMStatusDialogData,
    private dialogRef: MatDialogRef<RPMStatusDialog>,
    private fb: FormBuilder,
    private notify: NotifierService,
    private rpm: RPM
  ) {}

  ngOnInit() {
    this.createForms()
    this.resolveDialogData()
    this.fetchDeactivationReasons()
  }

  async enableRPM() {
    if (!this.accessibleOrganizations || !this.accessibleOrganizations.length) {
      return
    }

    const formValue = this.form.value

    try {
      await this.rpm.create({
        account: this.context.accountId,
        organization: this.form.value.organization,
        plan:
          formValue.deviceSupplied !== '-1' ? formValue.deviceSupplied : null,
        isActive: true,
        conditions: {
          hasMedicalNecessity: true,
          hadFaceToFace: true,
          patientConsented: true,
          receivedDevice: formValue.deviceSupplied !== '-1',
          goalsSet: true
        }
      })

      this.notify.success(_('NOTIFY.SUCCESS.ENABLED_RPM'))
      this.dialogRef.close(this.status)
    } catch (error) {
      this.notify.error(error)
    }
  }

  async disableRPM() {
    try {
      const deactivateFormValue = this.deactivateRpmForm.value

      await this.rpm.create({
        account: this.rpmEntry.rpmState.account.id,
        organization: this.rpmEntry.rpmState.organization.id,
        isActive: false,
        reason: deactivateFormValue.deactivationReason,
        note: this.requiresDeactivationNote
          ? deactivateFormValue.note
          : undefined
      })

      this.notify.success(_('NOTIFY.SUCCESS.DISABLED_RPM'))
      this.dialogRef.close(this.status)
    } catch (error) {
      this.notify.error(error)
    }
  }

  showAboutPage() {
    if (this.status !== 'about') {
      this.statusCache = this.status
      this.status = 'about'
    }
  }

  private createForms(): void {
    this.form = this.fb.group({
      organization: ['', Validators.required],
      patientConsented: [false, Validators.requiredTrue],
      hasMedicalNecessity: [false, Validators.requiredTrue],
      hadFaceToFace: [false, Validators.requiredTrue],
      goalsSet: [false, Validators.requiredTrue],
      deviceSupplied: ['', Validators.required]
    })

    this.deactivateRpmForm = this.fb.group({
      deactivationReason: ['', Validators.required],
      note: ''
    })

    this.deactivateRpmForm.controls.deactivationReason.valueChanges
      .pipe(untilDestroyed(this))
      .subscribe((deactivationReasonId: string) => {
        const deactivationReason = this.deactivationReasons.find(
          (deacReason) => deacReason.id === deactivationReasonId
        )

        this.requiresDeactivationNote =
          deactivationReason?.requiresNote ?? false

        this.deactivateRpmForm.controls.note.setValidators(
          this.requiresDeactivationNote ? Validators.required : []
        )
      })

    this.form.controls.organization.valueChanges
      .pipe(untilDestroyed(this))
      .subscribe((orgId) => {
        if (!orgId) {
          return
        }
        this.resolveOrgSettings(orgId)
      })
  }

  private async fetchDeactivationReasons(): Promise<void> {
    try {
      const raw = await this.rpm.getReasons({
        status: 'active',
        appliesToState: 'inactive',
        limit: 'all'
      })

      this.deactivationReasons = raw.data

      if (!this.deactivationReasons.length) {
        return
      }

      this.deactivateRpmForm.patchValue({
        deactivationReason: this.deactivationReasons[0].id
      })
    } catch (error) {
      this.notify.error(error)
    }
  }

  private resolveDevices(): void {
    this.rpmDevices = Object.values(RPM_DEVICES).map((device) => ({
      value: device.id,
      viewValue: device.displayName,
      imageSrc: device.imageSrc,
      imageClass: device.imageClass || ''
    }))

    if (this.allowNoDeviceOption) {
      return
    }

    this.rpmDevices = this.rpmDevices.filter((device) => device.value !== '-1')

    if (this.form.value.deviceSupplied === '-1') {
      this.form.patchValue({ deviceSupplied: '' })
    }
  }

  private resolveDialogData(): void {
    this.client = this.context.account
    this.rpmEntry = this.data.mostRecentEntry
    this.accessibleOrganizations = this.data.accessibleOrganizations
    this.inaccessibleOrganizations = this.data.inaccessibleOrganizations
    this.entryIsActive = this.rpmEntry ? this.rpmEntry.isActive : false
    this.status = this.rpmEntry ? 'has_entry' : 'no_entry'
    if (this.accessibleOrganizations && this.accessibleOrganizations.length) {
      this.form.patchValue({
        organization: this.accessibleOrganizations[0].organization.id
      })

      if (this.rpmEntry) {
        this.canDisableRPM = !!this.accessibleOrganizations.find(
          (org) => org.organization.id === this.rpmEntry.organization.id
        )
      }
    }
  }

  private async resolveOrgSettings(orgId: string): Promise<void> {
    try {
      const orgSingle = await this.context.getOrg(orgId)

      const deviceSelectorSetting = resolveConfig(
        'RPM.ALLOW_NO_DEVICE_SELECTION',
        orgSingle
      )
      this.allowNoDeviceOption =
        typeof deviceSelectorSetting === 'object'
          ? false
          : deviceSelectorSetting

      this.resolveDevices()
    } catch (error) {
      this.notify.error(error)
    }
  }
}
