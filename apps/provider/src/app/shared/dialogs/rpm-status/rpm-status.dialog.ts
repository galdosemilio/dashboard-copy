import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { MAT_DIALOG_DATA, MatDialogRef } from '@coachcare/material'
import { ContextService, NotifierService } from '@app/service'
import {
  RPMStateEntry,
  RPMStateEntryPendingStatus
} from '@app/shared/components/rpm/models'
import {
  AccountAccessData,
  OrganizationAccess,
  RPMReason
} from '@coachcare/sdk'
import { _ } from '@app/shared/utils'
import { RPM } from '@coachcare/sdk'
import * as moment from 'moment'
import { Subject } from 'rxjs'
import {
  RPMEditFormComponentEditMode,
  RPMEntryAgeStatus
} from './rpm-edit-form'
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy'

export interface RPMStatusDialogData {
  accessibleOrganizations: OrganizationAccess[]
  inaccessibleOrganizations: OrganizationAccess[]
  mostRecentEntry: RPMStateEntry
}

type DialogStatus = 'has_entry' | 'new_entry' | 'about'

@UntilDestroy()
@Component({
  selector: 'app-dialog-rpm-status',
  templateUrl: './rpm-status.dialog.html',
  styleUrls: ['./rpm-status.dialog.scss'],
  host: { class: 'ccr-dialog' },
  encapsulation: ViewEncapsulation.None
})
export class RPMStatusDialog implements OnInit {
  public accessibleOrganizations: OrganizationAccess[] = []
  public canDisableRPM = false
  public client: AccountAccessData
  public currentStepperStep = 0
  public deactivateRpmForm: FormGroup
  public editFormEditMode: RPMEditFormComponentEditMode
  public enableFormStepIndex: number
  public enableFormValidity: boolean
  public entryAge: RPMEntryAgeStatus
  public entryIsActive = false
  public entryPending: RPMStateEntryPendingStatus
  public form: FormGroup
  public inaccessibleOrganizations: OrganizationAccess[] = []
  public nextStep$: Subject<void> = new Subject<void>()
  public rpmEntry: RPMStateEntry
  public status: DialogStatus
  public statusCache: DialogStatus
  public updatedEntry: boolean

  deactivationReasons: RPMReason[] = []
  requiresDeactivationNote = false
  constructor(
    private context: ContextService,
    @Inject(MAT_DIALOG_DATA) public data: RPMStatusDialogData,
    private dialogRef: MatDialogRef<RPMStatusDialog>,
    private fb: FormBuilder,
    private notify: NotifierService,
    private rpm: RPM
  ) {}

  public ngOnInit(): void {
    this.createForms()
    this.resolveDialogData()
    this.fetchDeactivationReasons()
    this.calculateEntryAge()
  }

  public cancelEdition(): void {
    this.status = 'has_entry'

    this.form.get('editEntry').patchValue({
      primaryDiagnosis: this.rpmEntry.rpmState.diagnosis.primary,
      secondaryDiagnosis: this.rpmEntry.rpmState.diagnosis.secondary,
      note: this.rpmEntry.rpmState.note
    })
  }

  public async enableRPM(): Promise<void> {
    if (!this.accessibleOrganizations || !this.accessibleOrganizations.length) {
      return
    }

    const formValue = this.form.value.enableForm

    try {
      await this.rpm.create({
        diagnosis: {
          primary: formValue.setup.primaryDiagnosis,
          secondary: formValue.setup.secondaryDiagnosis
            ? formValue.setup.secondaryDiagnosis
            : undefined
        },
        supervisingProvider: formValue.setup.supervisingProvider,
        account: this.context.accountId,
        organization: formValue.setup.organization,
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

  public async disableRPM(): Promise<void> {
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

  public onEnableFormStepChange(index: number): void {
    this.currentStepperStep = index
  }

  public showAboutPage(): void {
    if (this.status !== 'about') {
      this.statusCache = this.status
      this.status = 'about'
    }
  }

  public async updateRPMEntry(): Promise<void> {
    try {
      const formValue = this.form.get('editEntry').value

      await this.rpm.upsertRPMDiagnosis({
        id: this.rpmEntry.rpmState.id,
        primary: formValue.primaryDiagnosis,
        secondary: formValue.secondaryDiagnosis
          ? formValue.secondaryDiagnosis
          : undefined,
        note: formValue.note ? formValue.note : undefined
      })

      this.entryAge =
        this.entryAge === 'after24' ? 'after24Edited' : this.entryAge

      this.rpmEntry.rpmState.diagnosis.primary = formValue.primaryDiagnosis
      this.rpmEntry.rpmState.diagnosis.secondary = formValue.secondaryDiagnosis
        ? formValue.secondaryDiagnosis
        : undefined

      this.updatedEntry = true
      this.status = 'has_entry'
      this.notify.success(_('NOTIFY.SUCCESS.UPDATED_RPM'))
    } catch (error) {
      this.notify.error(error)
    }
  }

  private async calculateEntryAge(): Promise<void> {
    try {
      if (!this.rpmEntry) {
        this.entryAge = 'before24'
        return
      }

      const mostRecentEntryAge = Math.abs(
        moment(this.rpmEntry.rpmState.createdAt).diff(moment(), 'hours')
      )
      const diagnosisAuditEntries = await this.rpm.getDiagnosisAuditList({
        id: this.rpmEntry.rpmState.id
      })

      this.entryAge = 'before24'

      if (mostRecentEntryAge >= 24) {
        this.entryAge = diagnosisAuditEntries.data.length
          ? 'after24Edited'
          : 'after24'
      }
    } catch (error) {
      this.notify.error(error)
    }
  }

  private createForms(): void {
    this.form = this.fb.group({
      enableForm: [null, Validators.required],
      organization: ['', Validators.required],
      patientConsented: [false, Validators.requiredTrue],
      hasMedicalNecessity: [false, Validators.requiredTrue],
      hadFaceToFace: [false, Validators.requiredTrue],
      goalsSet: [false, Validators.requiredTrue],
      deviceSupplied: ['', Validators.required],
      editEntry: [null, Validators.required]
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

  private resolveDialogData(): void {
    this.client = this.context.account
    this.rpmEntry = this.data.mostRecentEntry
    this.accessibleOrganizations = this.data.accessibleOrganizations
    this.inaccessibleOrganizations = this.data.inaccessibleOrganizations
    this.entryIsActive = this.rpmEntry ? this.rpmEntry.isActive : false
    this.entryPending = this.rpmEntry ? this.rpmEntry.pending : undefined
    this.status = this.rpmEntry ? 'has_entry' : 'new_entry'
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

    if (this.entryIsActive) {
      this.form.get('editEntry').patchValue({
        primaryDiagnosis: this.rpmEntry.rpmState.diagnosis?.primary,
        secondaryDiagnosis: this.rpmEntry.rpmState.diagnosis?.secondary,
        note: this.rpmEntry.rpmState.note ?? ''
      })
    }
  }
}
