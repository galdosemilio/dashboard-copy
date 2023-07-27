import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Inject,
  OnInit,
  ViewEncapsulation
} from '@angular/core'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { MAT_DIALOG_DATA, MatDialogRef } from '@coachcare/material'
import {
  CareManagementService,
  CareServiceType,
  ContextService,
  NotifierService
} from '@app/service'
import {
  RPMStateEntry,
  RPMStateEntryPendingStatus
} from '@app/shared/components/rpm/models'
import {
  AccountAccessData,
  CareManagementState,
  OrganizationAccess,
  RPMReason
} from '@coachcare/sdk'
import { _ } from '@app/shared/utils'
import * as moment from 'moment'
import { Subject } from 'rxjs'
import {
  RPMEditFormComponentEditMode,
  RPMEntryAgeStatus
} from './rpm-edit-form'
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy'
import { CareServiceEnableFormStepperInfo } from './rpm-enable-form'
import { isEqual } from 'lodash'

type DialogStatus =
  | 'initial'
  | 'view_session'
  | 'new_entry'
  | 'about'
  | 'edit_supervising_provider'

export interface RPMStatusDialogData {
  accessibleOrganizations: OrganizationAccess[]
  inaccessibleOrganizations: OrganizationAccess[]
  initialStatus?: DialogStatus
  closeAfterChange?: boolean
  careEntries: RPMStateEntry[]
  activeCareEntries: RPMStateEntry[]
}

@UntilDestroy()
@Component({
  selector: 'app-dialog-rpm-status',
  templateUrl: './rpm-status.dialog.html',
  styleUrls: ['./rpm-status.dialog.scss'],
  host: { class: 'ccr-dialog' },
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RPMStatusDialog implements OnInit {
  public accessibleOrganizations: OrganizationAccess[] = []
  public client: AccountAccessData
  public deactivateRpmForm: FormGroup
  public editFormEditMode: RPMEditFormComponentEditMode
  public enableFormStepIndex: number
  public enableFormValidity: boolean
  public entryAge: RPMEntryAgeStatus
  public entryPending: RPMStateEntryPendingStatus
  public form: FormGroup
  public inaccessibleOrganizations: OrganizationAccess[] = []
  public nextStep$: Subject<void> = new Subject<void>()
  public rpmEntry: RPMStateEntry
  public updatedEntry: boolean
  public closeAfterChange: boolean = false

  deactivationReasons: RPMReason[] = []
  requiresDeactivationNote = false

  // from here and below you'll put what won't be deleted
  careServiceTypes: CareServiceType[] = []
  activeCareEntries: RPMStateEntry[] = []
  careEntries: RPMStateEntry[] = []
  currentStepperStep = 0
  stepperStepLength = 0
  newEntryType?: CareServiceType

  get canDisableRPM(): boolean {
    if (!this.rpmEntry) {
      return false
    }

    return this.accessibleOrganizations.some(
      (org) => org.organization.id === this.rpmEntry.organization.id
    )
  }

  get canEnableCareService(): boolean {
    return this.accessibleOrganizations.length > 0
  }

  get inactiveCareEntries(): RPMStateEntry[] {
    return this.careEntries.filter((entry) => !entry.isActive)
  }

  get entryIsActive(): boolean {
    return this.rpmEntry?.isActive ?? false
  }

  set status(status: DialogStatus) {
    this._statusCache = [...this._statusCache, this._currentStatus]
    this._currentStatus = status

    if (this.cdr) {
      this.cdr.markForCheck()
    }
  }

  get status(): DialogStatus {
    return this._currentStatus
  }

  get isChangedCareEntries() {
    return (
      this.updatedEntry ||
      !isEqual(this.data.activeCareEntries, this.activeCareEntries)
    )
  }

  get shouldStartImmediately() {
    return this.newEntryType.serviceType.id === '5' // hard coded for BHI, we need to get it from server
  }

  private _currentStatus: DialogStatus = 'initial'
  private _statusCache: DialogStatus[] = []

  constructor(
    private cdr: ChangeDetectorRef,
    private context: ContextService,
    @Inject(MAT_DIALOG_DATA) public data: RPMStatusDialogData,
    private dialogRef: MatDialogRef<RPMStatusDialog>,
    private fb: FormBuilder,
    private notify: NotifierService,
    private careManagementState: CareManagementState,
    private careManagementService: CareManagementService
  ) {}

  public ngOnInit(): void {
    this.careServiceTypes = Object.values(
      this.careManagementService.serviceTypeMap
    ).filter((service) =>
      this.context.accessibleCareManagementServiceTypes.some(
        (accessServ) => accessServ.id === service.serviceType.id
      )
    )
    this.createForms()
    this.resolveDialogData()
    void this.fetchDeactivationReasons()

    this.dialogRef
      .beforeClosed()
      .pipe(untilDestroyed(this))
      .subscribe(() => {
        this.dialogRef.close({
          rpmEntry: this.rpmEntry,
          isChangedCareEntries: this.isChangedCareEntries
        })
      })
  }

  getCareEntry(id: string): RPMStateEntry | null {
    return this.activeCareEntries.find((entry) => entry.serviceType.id === id)
  }

  goBack(): void {
    this._currentStatus = this._statusCache.pop() ?? 'initial'
    this.cdr.markForCheck()
  }

  hasConflict(id: string): boolean {
    const careService =
      Object.values(this.careManagementService.serviceTypeMap).find(
        (service) => service.serviceType.id === id
      ) ?? null

    if (!careService) {
      return false
    }

    return careService.conflicts?.length > 0
      ? this.activeCareEntries.some((entry) =>
          careService.conflicts.includes(entry.serviceType.id)
        )
      : false
  }

  public cancelEdition(): void {
    this.goBack()
    this.refreshDiagnosisForm()
  }

  public async enableRPM(): Promise<void> {
    if (!this.accessibleOrganizations?.length) {
      return
    }

    const formValue = this.form.value.enableForm

    try {
      await this.careManagementState.create({
        serviceType: this.newEntryType.serviceType.id,
        diagnosis: {
          primary: formValue.setup.primaryDiagnosis,
          secondary: formValue.setup.secondaryDiagnosis
            ? formValue.setup.secondaryDiagnosis
            : undefined,
          other: formValue.setup.otherDiagnosis || undefined
        },
        startedAt: formValue.setup.startDate || undefined, // @TODO: add this to @coachcare/sdk -- Zcyon
        supervisingProvider: formValue.setup.supervisingProvider,
        account: this.context.accountId,
        organization: formValue.setup.organization,
        plan:
          formValue.deviceSupplied && formValue.deviceSupplied !== '-1'
            ? formValue.deviceSupplied
            : null,
        isActive: true,
        conditions: {
          hasMedicalNecessity: true,
          hadFaceToFace: true,
          patientConsented: true,
          receivedDevice:
            !!formValue.deviceSupplied && formValue.deviceSupplied !== '-1',
          goalsSet: true
        }
      } as any) // @TODO: after adding all properties to the SDK, remove this 'any' -- Zcyon
      await this.resolveLastActiveEpisodeOfCare(
        formValue.setup.organization,
        this.newEntryType.serviceType.id
      )
      this.notify.success(_('NOTIFY.SUCCESS.ENABLED_CARE_SERVICE'))
      this.status = 'initial'
    } catch (error) {
      this.notify.error(error)
    }
  }

  private async resolveLastActiveEpisodeOfCare(
    organization: string,
    serviceType: string
  ) {
    const res = await this.careManagementState.getList({
      organization,
      serviceType,
      account: this.context.accountId,
      limit: 1
    })

    const entity = res.data[0]

    if (!entity?.isActive) {
      return
    }

    const careEntity = new RPMStateEntry({ rpmState: entity })

    this.activeCareEntries = [...this.activeCareEntries, careEntity]
  }

  public async disableRPM(): Promise<void> {
    try {
      const deactivateFormValue = this.deactivateRpmForm.value

      await this.careManagementState.create({
        serviceType: this.rpmEntry.serviceType.id,
        account: this.rpmEntry.rpmState.account.id,
        organization: this.rpmEntry.rpmState.organization.id,
        isActive: false,
        reason: deactivateFormValue.deactivationReason,
        note: this.requiresDeactivationNote
          ? deactivateFormValue.note
          : undefined
      })

      this.notify.success(_('NOTIFY.SUCCESS.DISABLED_CARE_SERVICE'))

      this.rpmEntry.isActive = false // this is used for filtering at this level
      this.rpmEntry.rpmState.isActive = false // this could be used for inner components that want access to the 'raw' rpm state

      this.activeCareEntries = this.activeCareEntries.filter(
        (entry) => entry.rpmState.id !== this.rpmEntry.rpmState.id
      )

      this.status = 'initial'
    } catch (error) {
      this.notify.error(error)
    }
  }

  public onAddCareEntry(type: CareServiceType): void {
    this.status = 'new_entry'
    this.newEntryType = type
    this.cdr.markForCheck()
  }

  public onEnableFormStepChange(
    stepperChangeInfo: CareServiceEnableFormStepperInfo
  ): void {
    this.currentStepperStep = stepperChangeInfo.current
    this.stepperStepLength = stepperChangeInfo.count - 1
  }

  public async onInspectCareEntry(entry: RPMStateEntry): Promise<void> {
    try {
      this.rpmEntry = entry
      this.status = 'view_session'
      await this.calculateEntryAge()

      if (this.entryIsActive) {
        this.refreshDiagnosisForm()
      }
      this.cdr.markForCheck()
    } catch (err) {
      this.notify.error(err)
    }
  }

  public showAboutPage(): void {
    if (this.status !== 'about') {
      this.status = 'about'
    }
  }

  public async updateRPMEntry(): Promise<void> {
    try {
      const formValue = this.form.get('editEntry').value

      await this.careManagementState.upsertCareManagementStateDiagnosis({
        id: this.rpmEntry.rpmState.id,
        primary: formValue.primaryDiagnosis,
        secondary: formValue.secondaryDiagnosis || undefined,
        other: formValue.otherDiagnosis || undefined,
        note: formValue.note || undefined
      })

      this.entryAge =
        this.entryAge === 'after24' ? 'after24Edited' : this.entryAge

      this.rpmEntry.rpmState.diagnosis.primary = formValue.primaryDiagnosis
      this.rpmEntry.rpmState.diagnosis.secondary = formValue.secondaryDiagnosis
        ? formValue.secondaryDiagnosis
        : undefined
      ;(this.rpmEntry.rpmState.diagnosis as any).other = // add this property to the SDK -- Zcyon
        formValue.otherDiagnosis ?? undefined

      this.updatedEntry = true
      this.status = 'initial'
      this.notify.success(_('NOTIFY.SUCCESS.UPDATED_RPM'))
      this.cdr.markForCheck()
    } catch (error) {
      this.notify.error(error)
    }
  }

  public async updateSupervisingProvider(): Promise<void> {
    try {
      const formValue = this.form.get('editSupervisingProvider').value

      await this.careManagementState.updateSupervisingProvider(
        this.rpmEntry.rpmState.id,
        {
          account: formValue.account,
          note: formValue.note
        }
      )

      this.rpmEntry.rpmState.supervisingProvider = {
        id: formValue.account,
        firstName: formValue.name,
        lastName: ''
      }

      this.notify.success(_('NOTIFY.SUCCESS.UPDATED_RPM'))

      if (this.closeAfterChange) {
        this.dialogRef.close(this.rpmEntry)
      } else {
        this.status = 'initial'
      }
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
      const diagnosisAuditEntries =
        await this.careManagementState.getDiagnosisAuditList({
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
      editEntry: [null, Validators.required],
      editSupervisingProvider: [null, Validators.required]
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
        this.deactivateRpmForm.controls.note.updateValueAndValidity()
      })

    this.form.controls.enableForm.valueChanges
      .pipe(untilDestroyed(this))
      .subscribe(() => this.cdr.markForCheck())
  }

  private async fetchDeactivationReasons(): Promise<void> {
    try {
      const raw = await this.careManagementState.getReasons({
        status: 'active',
        appliesToState: 'inactive',
        limit: 'all'
      })

      this.deactivationReasons = raw.data

      if (!this.deactivationReasons.length) {
        return
      }
    } catch (error) {
      this.notify.error(error)
    }
  }

  private refreshDiagnosisForm(): void {
    this.form.get('editEntry').patchValue({
      primaryDiagnosis: this.rpmEntry.rpmState.diagnosis?.primary,
      secondaryDiagnosis: this.rpmEntry.rpmState.diagnosis?.secondary,
      otherDiagnosis: (this.rpmEntry.rpmState.diagnosis as any)?.other, // @TODO: add this to the SDK -- Zcyon
      note: this.rpmEntry.rpmState.note
    })
  }

  private resolveDialogData(): void {
    this.client = this.context.account
    this.activeCareEntries = this.data.activeCareEntries
    this.careEntries = this.data.careEntries.slice().reverse()
    this.accessibleOrganizations = this.data.accessibleOrganizations
    this.inaccessibleOrganizations = this.data.inaccessibleOrganizations
    this.entryPending = this.rpmEntry ? this.rpmEntry.pending : undefined
    this.closeAfterChange = this.data.closeAfterChange ?? false

    if (this.accessibleOrganizations?.length) {
      this.form.patchValue({
        organization: this.accessibleOrganizations[0].organization.id
      })
    }
  }
}
