import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { MAT_DIALOG_DATA, MatDialogRef } from '@coachcare/common/material'
import { ContextService, NotifierService } from '@app/service'
import { RPMStateEntry } from '@app/shared/components/rpm/models'
import {
  AccountAccessData,
  OrganizationAccess,
  RPMDeactivationReason
} from '@app/shared/selvera-api'
import { _ } from '@app/shared/utils'
import { RPM } from 'selvera-api'

export interface RPMStatusDialogData {
  accessibleOrganizations: OrganizationAccess[]
  inaccessibleOrganizations: OrganizationAccess[]
  mostRecentEntry: RPMStateEntry
}

type DialogStatus = 'no_entry' | 'has_entry' | 'new_entry' | 'about'

@Component({
  selector: 'app-dialog-rpm-status',
  templateUrl: './rpm-status.dialog.html',
  styleUrls: ['./rpm-status.dialog.scss'],
  host: { class: 'ccr-dialog' },
  encapsulation: ViewEncapsulation.None
})
export class RPMStatusDialog implements OnInit {
  accessibleOrganizations: OrganizationAccess[] = []
  canDisableRPM = false
  client: AccountAccessData
  deactivationReasons: RPMDeactivationReason[] = []
  deactivateRpmForm: FormGroup
  entryIsActive = false
  form: FormGroup
  inaccessibleOrganizations: OrganizationAccess[] = []
  rpmEntry: RPMStateEntry
  status: DialogStatus = 'no_entry'
  statusCache: DialogStatus

  constructor(
    private context: ContextService,
    @Inject(MAT_DIALOG_DATA) public data: RPMStatusDialogData,
    private dialogRef: MatDialogRef<RPMStatusDialog>,
    private fb: FormBuilder,
    private notify: NotifierService,
    private rpm: RPM
  ) {}

  ngOnInit() {
    this.form = this.fb.group({
      organization: ['', Validators.required],
      patientConsented: [false, Validators.requiredTrue],
      hasMedicalNecessity: [false, Validators.requiredTrue],
      hadFaceToFace: [false, Validators.requiredTrue],
      receivedDevice: [false, Validators.requiredTrue],
      goalsSet: [false, Validators.requiredTrue]
    })
    this.deactivateRpmForm = this.fb.group({
      deactivationReason: ['', Validators.required]
    })
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
    this.fetchDeactivationReaons()
  }

  async enableRPM() {
    if (!this.accessibleOrganizations || !this.accessibleOrganizations.length) {
      return
    }

    try {
      await this.rpm.create({
        account: this.context.accountId,
        organization: this.form.value.organization,
        isActive: true,
        conditions: {
          hasMedicalNecessity: true,
          hadFaceToFace: true,
          patientConsented: true,
          receivedDevice: true,
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
        deactivationReason: deactivateFormValue.deactivationReason
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

  private async fetchDeactivationReaons(): Promise<void> {
    try {
      const raw = await this.rpm.getDeactivationReasons({
        status: 'active',
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
}
