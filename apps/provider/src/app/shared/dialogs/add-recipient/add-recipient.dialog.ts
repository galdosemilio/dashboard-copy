import {
  ChangeDetectorRef,
  Component,
  Inject,
  OnDestroy,
  OnInit,
  ViewEncapsulation
} from '@angular/core'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { MAT_DIALOG_DATA, MatDialogRef } from '@coachcare/material'
import {
  Sequence,
  SequenceState
} from '@app/dashboard/sequencing/models/sequence'
import { Transition } from '@app/dashboard/sequencing/models/sequence-transition'
import { ContextService, NotifierService } from '@app/service'
import {
  AccountAccessData,
  OrganizationEntity,
  OrganizationProvider,
  Sequence as SelveraSequenceService
} from '@coachcare/npm-api'
import { _ } from '@app/shared/utils'
import * as moment from 'moment'
import { untilDestroyed } from 'ngx-take-until-destroy'

interface AddRecipientDialogProps {
  account?: AccountAccessData
  allowBulkEnrollment?: boolean
  readonly?: boolean
  sequence: Sequence
}

interface TableStep {
  date: string
  index: number
  name: string
}

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
  public columns: string[] = ['step', 'title', 'date']
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
  public steps: TableStep[] = []
  public tomorrow: moment.Moment = moment().add(1, 'day')

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
    private seq: SelveraSequenceService
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
      this.selectedOrg = $event
      this.fetchOrgChildren(this.selectedOrg.id)
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

      await this.seq.createBulkOrganizationSeqEnrollments({
        organization: this.currentOrg.id,
        sequence: this.data.sequence.id,
        executeAt: {
          local: moment(this.executeAt).format(this.executeAtFormat)
        },
        transition: transition.id
      })

      this.bulkEnrollProgress = this.calculateProgress(
        ++completedOrgs,
        orgAmount
      )
      this.cdr.detectChanges()

      while (orgChildren.length) {
        this.currentOrg = orgChildren.shift()
        await this.seq.createBulkOrganizationSeqEnrollments({
          organization: this.currentOrg.id,
          sequence: this.data.sequence.id,
          executeAt: {
            local: moment(this.executeAt).format(this.executeAtFormat)
          },
          transition: transition.id
        })
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
        organization: this.context.organizationId,
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

  private calcDelayedDate(serverDelay: string): string {
    const splitServerDelay = serverDelay.split(/\s/)
    let hourAmount
    let daysAmount

    switch (splitServerDelay.length) {
      case 1:
        hourAmount = +splitServerDelay[0].split(/\:/)[0]
        break

      case 2:
        daysAmount = +splitServerDelay[0]
        break

      case 3:
        daysAmount = +splitServerDelay[0]
        hourAmount = +splitServerDelay[2].split(/\:/)[0]
        break
    }

    if (!this.delayAcc) {
      this.delayAcc = moment(this.form.value.startDate || undefined).startOf(
        'day'
      )
    }
    this.delayAcc = daysAmount
      ? this.delayAcc.add(daysAmount, 'days')
      : this.delayAcc
    this.delayAcc = hourAmount
      ? this.delayAcc.add(hourAmount, 'hours')
      : this.delayAcc

    return this.delayAcc.toISOString()
  }

  private calculateProgress(completed: number, total: number): number {
    return Math.round((completed / total) * 100)
  }

  private createForm(): void {
    this.form = this.fb.group({
      startDate: [this.tomorrow, Validators.required],
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

  private lockDialog(): void {
    this.dialog.disableClose = true
  }

  private refreshStepInfo(): void {
    this.stepOptions = this.sequence
      ? this.sequence.states.filter((state) => state.name !== 'root')
      : []

    this.steps = this.stepOptions.map((state, index) => ({
      index: index + 1,
      name: state.name,
      date: this.calcDelayedDate(state.serverDelay)
    }))

    this.executeAt =
      this.steps.length > 1 && this.form.value.startStep
        ? this.steps[this.form.value.startStep - 1].date
        : moment(this.form.value.startDate || undefined)
            .startOf('day')
            .toISOString()

    this.steps.splice(0, this.form.value.startStep || 0)

    delete this.delayAcc
  }

  private unlockDialog(): void {
    this.dialog.disableClose = false
  }
}
