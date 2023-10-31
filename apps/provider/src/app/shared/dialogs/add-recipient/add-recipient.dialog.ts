import {
  ChangeDetectorRef,
  Component,
  Inject,
  OnDestroy,
  OnInit,
  ViewEncapsulation
} from '@angular/core'
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms'
import { MAT_DIALOG_DATA, MatDialogRef } from '@coachcare/material'
import {
  Sequence,
  SequenceState
} from '@app/dashboard/sequencing/models/sequence'
import { Transition } from '@app/dashboard/sequencing/models/sequence-transition'
import { ContextService, NotifierService } from '@app/service'
import {
  AccountAccessData,
  CareManagementPreference,
  CareManagementServiceType,
  OrganizationEntity,
  OrganizationProvider,
  PackageAssociation,
  PackageOrganization,
  Sequence as SelveraSequenceService
} from '@coachcare/sdk'
import { _ } from '@app/shared/utils'
import * as moment from 'moment'
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy'

interface AddRecipientDialogProps {
  account?: AccountAccessData
  allowBulkEnrollment?: boolean
  readonly?: boolean
  sequence: Sequence
}

@UntilDestroy()
@Component({
  selector: 'sequencing-add-recipient-dialog',
  templateUrl: './add-recipient.dialog.html',
  styleUrls: ['./add-recipient.dialog.scss'],
  host: {
    class: 'ccr-dialog'
  },
  encapsulation: ViewEncapsulation.None
})
export class AddRecipientDialog implements OnDestroy, OnInit {
  set sequence(sequence: Sequence) {
    this._sequence = sequence
    this.refreshStepInfo()
  }

  get sequence(): Sequence {
    return this._sequence
  }

  public account: AccountAccessData
  public allowBulkEnrollment = false
  public bulkEnrollProgress = 0
  public currentOrg: OrganizationEntity
  public form: FormGroup
  public isLoading: boolean
  public preexistingSequence: boolean
  public readonly = false
  public recipients: any[] = []
  public orgChildren: OrganizationEntity[] = []
  public selectedOrg: OrganizationEntity
  public selectedTabIndex = 0
  public state: 'form' | 'processing' = 'form'
  public stepOptions: SequenceState[] = []
  public today: moment.Moment = moment()
  public isFirstStepImmediateProcess = false
  public packagesControl = new FormControl([])
  public packages: PackageAssociation[] = []
  public serviceTypesControl = new FormControl([])
  public serviceTypes: CareManagementServiceType[] = []
  public minDateForEnrollment = moment().subtract(8, 'days')

  private _sequence: Sequence
  private delayAcc: moment.Moment
  private executeAt: string
  private executeAtFormat = 'YYYY-MM-DDTHH:mm:ss'

  constructor(
    @Inject(MAT_DIALOG_DATA) private data: AddRecipientDialogProps,
    private dialog: MatDialogRef<AddRecipientDialog>,
    private cdr: ChangeDetectorRef,
    private context: ContextService,
    private fb: FormBuilder,
    private notify: NotifierService,
    private organization: OrganizationProvider,
    private seq: SelveraSequenceService,
    private packageOrganization: PackageOrganization,
    private carePreference: CareManagementPreference
  ) {}

  public ngOnDestroy(): void {}

  public ngOnInit(): void {
    this.createForm()
    this.account = this.data ? this.data.account : undefined
    this.readonly = this.data ? this.data.readonly : false
    this.sequence = this.data ? this.data.sequence : undefined
    this.allowBulkEnrollment = this.data
      ? this.data.allowBulkEnrollment || false
      : false
    this.preexistingSequence = !!this.sequence

    if (this.account) {
      this.onAddRecipient(this.account)
    }
  }

  public onAddRecipient(recipient: any): void {
    if (
      !recipient ||
      recipient.target ||
      this.recipients.find((rec) => rec.id === recipient.id)
    ) {
      return
    }
    this.recipients = [...(this.recipients || []), recipient]
  }

  public onOrgSelect($event: OrganizationEntity): void {
    if (typeof $event === 'object' && $event.id) {
      this.packagesControl.setValue([])
      this.serviceTypesControl.setValue([])
      this.selectedOrg = $event
      void this.fetchOrgChildren(this.selectedOrg.id)
      void this.fetchOrgPackages(this.selectedOrg.id)
      void this.resolveServiceTypes(this.selectedOrg.id)
    }
  }

  public onRemoveRecipient(id: string): void {
    this.recipients = this.recipients.filter((recipient) => recipient.id !== id)
  }

  public onSelectSequence(sequence: Sequence): void {
    this.sequence = sequence
  }

  public onTabIndexChange($event: any): void {
    this.selectedTabIndex = $event
  }

  public async onBulkSubmit(): Promise<void> {
    try {
      this.lockDialog()
      this.state = 'processing'
      this.isLoading = true
      let completedOrgs = 0
      const formValue = this.form.value
      const orgAmount = this.orgChildren.length + 1
      const orgChildren = this.orgChildren.slice()
      const transition = (this.sequence.transitions as Transition[]).find(
        (t) => t.to.id === this.stepOptions[formValue.startStep].id
      )

      this.currentOrg = this.selectedOrg
      this.state = 'processing'

      await this.seq.createBulkOrganizationSeqEnrollments(
        this.bulkDataRequest({
          org: this.currentOrg,
          transition
        })
      )

      this.bulkEnrollProgress = this.calculateProgress(
        ++completedOrgs,
        orgAmount
      )
      this.cdr.detectChanges()

      while (orgChildren.length) {
        const org = orgChildren.shift()
        await this.seq.createBulkOrganizationSeqEnrollments(
          this.bulkDataRequest({
            org,
            transition
          })
        )
        this.bulkEnrollProgress = this.calculateProgress(
          ++completedOrgs,
          orgAmount
        )
        this.cdr.detectChanges()
      }

      this.notify.success(_('NOTIFY.SUCCESS.SEQUENCING_PATIENTS_ENROLLED'))
      this.dialog.close()
    } catch (error) {
      this.notify.error(error)
    } finally {
      this.state = 'form'
      this.isLoading = false
      this.unlockDialog()
    }
  }

  public async onSubmit() {
    try {
      const formValue = this.form.value
      const transition = (this.sequence.transitions as Transition[]).find(
        (t) => t.to.id === this.stepOptions[formValue.startStep].id
      )
      await this.seq.createBulkSeqEnrollments({
        createdBy: this.context.user.id,
        organization:
          this.data.sequence.enrollment?.organization.id ??
          this.context.organizationId,
        sequence: this.sequence.id,
        transition: transition.id,
        accounts: this.recipients.map((recipient) => recipient.id),
        executeAt: {
          local: moment(this.executeAt).format(this.executeAtFormat)
        }
      })
      this.notify.success(_('NOTIFY.SUCCESS.SEQUENCING_PATIENTS_ENROLLED'))
      this.dialog.close()
    } catch (error) {
      this.notify.error(_('NOTIFY.ERROR.SEQUENCING_NO_ENROLLED'))
    }
  }

  public onPackageRemoved(packageRecord): void {
    const packages = this.packagesControl.value.filter(
      (p) => p.package.id !== packageRecord.package.id
    )

    this.packagesControl.setValue(packages)
  }
  public onServiceTypeRemoved(serviceType): void {
    const serviceTypes = this.serviceTypesControl.value.filter(
      (p) => p.id !== serviceType.id
    )

    this.serviceTypesControl.setValue(serviceTypes)
  }

  private bulkDataRequest({ org, transition }): {
    organization: string
    targetOrganization: string
    sequence: string
    executeAt: {
      local: string
    }
    transition: string
    packages?: string[]
    serviceTypes?: string[]
  } {
    const { value: packages } = this.packagesControl
    const { value: serviceTypes } = this.serviceTypesControl
    return {
      organization: org.id,
      targetOrganization:
        this.data.sequence.enrollment?.organization.id ?? org.id,
      sequence: this.data.sequence.id,
      executeAt: {
        local: moment(this.executeAt).format(this.executeAtFormat)
      },
      transition: transition.id,
      packages:
        packages.length > 0 ? packages.map((p) => p.package.id) : undefined,
      serviceTypes:
        serviceTypes.length > 0 ? serviceTypes.map((p) => p.id) : undefined
    }
  }

  private calcDelayedDate(
    serverDelay: string,
    stepOptionsLength: number,
    currentIndex: number
  ): string | undefined {
    const duration = this.parseServerDelay(serverDelay)

    if (!this.delayAcc) {
      this.delayAcc = moment(this.form.value.startDate).startOf('day')
    }

    if (duration.toISOString() === 'P0D') {
      this.delayAcc = this.delayAcc.add(1, 'days')
    }

    if (currentIndex === stepOptionsLength + 1) {
      this.delayAcc = moment(this.delayAcc).add(1, 'days').startOf('day')
    }

    if (duration.toISOString() !== 'Invalid date') {
      this.delayAcc = this.delayAcc.add(duration)
    }

    return this.delayAcc.toISOString() > moment().toISOString()
      ? this.delayAcc.toISOString()
      : undefined
  }

  private calculateProgress(completed: number, total: number): number {
    return Math.round((completed / total) * 100)
  }

  private createForm(): void {
    this.form = this.fb.group({
      startDate: [this.today, Validators.required],
      startStep: [0, Validators.required]
    })

    this.form.valueChanges
      .pipe(untilDestroyed(this))
      .subscribe(() => this.refreshStepInfo())
  }

  private async fetchOrgChildren(orgId: string): Promise<void> {
    try {
      const response = await this.organization.getDescendants({
        organization: orgId,
        offset: 0,
        limit: 'all'
      })
      this.orgChildren = response.data
    } catch (error) {
      this.notify.error(error)
    }
  }

  private async fetchOrgPackages(orgId: string): Promise<void> {
    try {
      const response = await this.packageOrganization.getAll({
        organization: orgId,
        offset: 0,
        limit: 'all'
      })
      this.packages = response.data
    } catch (error) {
      this.notify.error(error)
    }
  }

  private async resolveServiceTypes(orgId: string): Promise<void> {
    try {
      this.serviceTypes = []

      const res = await this.carePreference.getAllCareManagementPreferences({
        organization: orgId
      })

      const orgServiceTypes = res.data
        .filter((entry) => entry.isActive)
        .map((entry) => entry.serviceType)

      this.serviceTypes = [
        ...this.context.user.careManagementServiceTypes.filter(
          (userServiceType) =>
            orgServiceTypes.find(
              (orgServiceType) => orgServiceType.id === userServiceType.id
            )
        )
      ]
    } catch (error) {
      this.notify.error(error)
    }
  }

  private lockDialog(): void {
    this.dialog.disableClose = true
  }

  private refreshStepInfo(): void {
    this.stepOptions = this.sequence
      ? this.sequence.states.filter((state) => state.name !== 'root')
      : []

    const stepsCopy = this.stepOptions.slice()

    const missingSteps = stepsCopy.splice(0, this.form.value.startStep || 0)

    const steps = stepsCopy.map((state, index) => ({
      index: index + 1,
      name: state.name,
      date: this.calcDelayedDate(
        state.serverDelay,
        stepsCopy.length - missingSteps.length,
        index + 1
      )
    }))

    const startDateMoment = moment(
      this.form.value.startDate || undefined
    ).startOf('day')

    for (const missingStep of missingSteps) {
      const duration = this.parseServerDelay(missingStep.serverDelay)
      startDateMoment.add(duration)
    }

    this.executeAt = startDateMoment.toISOString()

    this.isFirstStepImmediateProcess = steps.some(
      (step) => step.date === undefined
    )

    delete this.delayAcc
  }

  private parseServerDelay(serverDelay: string): moment.Duration {
    const parsedDelay = serverDelay.replace(/\s?days?/, '')
    const duration =
      parsedDelay.length > 7
        ? moment.duration(parsedDelay)
        : moment.duration({
            days: parseInt(parsedDelay, 10)
          })

    return duration
  }

  private unlockDialog(): void {
    this.dialog.disableClose = false
  }
}
