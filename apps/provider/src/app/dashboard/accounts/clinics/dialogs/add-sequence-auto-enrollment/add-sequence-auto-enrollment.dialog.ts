import { Component, OnInit } from '@angular/core'
import { FormBuilder, FormGroup } from '@angular/forms'
import { MatDialogRef } from '@coachcare/material'
import { ContextService, NotifierService } from '@app/service'
import { SelectOptions } from '@app/shared'
import { _ } from '@app/shared/utils'
import { Sequence as SequenceProvider } from '@coachcare/sdk'
import { Sequence, SequenceState } from '@app/dashboard/sequencing/models'

@Component({
  selector: 'app-clinics-add-seq-auto-enroll-dialog',
  templateUrl: './add-sequence-auto-enrollment.dialog.html',
  styleUrls: ['./add-sequence-auto-enrollment.dialog.scss'],
  host: { class: 'ccr-dialog' }
})
export class AddSequenceAutoenrollmentDialog implements OnInit {
  public isAdmin: boolean
  public form: FormGroup
  public daysOfWeek: SelectOptions<number> = [
    {
      value: 0,
      viewValue: _('DAYS.SUNDAY')
    },
    {
      value: 1,
      viewValue: _('DAYS.MONDAY')
    },
    {
      value: 2,
      viewValue: _('DAYS.TUESDAY')
    },
    {
      value: 3,
      viewValue: _('DAYS.WEDNESDAY')
    },
    {
      value: 4,
      viewValue: _('DAYS.THURSDAY')
    },
    {
      value: 5,
      viewValue: _('DAYS.FRIDAY')
    },
    {
      value: 6,
      viewValue: _('DAYS.SATURDAY')
    }
  ]
  public daysOfMonth: SelectOptions<number> = []
  public organizationId: string
  public selectedSequence?: Sequence
  public sequenceStates: SequenceState[]

  constructor(
    private context: ContextService,
    private dialogRef: MatDialogRef<AddSequenceAutoenrollmentDialog>,
    private fb: FormBuilder,
    private notifier: NotifierService,
    private sequence: SequenceProvider
  ) {}

  public ngOnInit(): void {
    this.organizationId = this.context.clinic.id

    this.createDaysOptions()
    this.createForm()
    this.useControl('dayOfWeek')
  }

  public async onSelectSequence(sequence: Sequence): Promise<void> {
    try {
      this.selectedSequence = sequence

      this.sequenceStates = this.selectedSequence.states
        ? this.selectedSequence.states.filter((state) => state.name !== 'root')
        : []

      this.isAdmin = await this.context.orgHasPerm(
        sequence.organization.id,
        'admin'
      )

      this.form.patchValue({
        sequenceState: this.sequenceStates?.length
          ? this.sequenceStates[0].id
          : '-1'
      })
    } catch (error) {
      this.notifier.error(error)
    }
  }

  public async onSubmit(): Promise<void> {
    try {
      await this.sequence.updateSequence({
        id: this.selectedSequence.id,
        organization: this.selectedSequence.organization.id,
        enrollmentOnAssociation: true
      })

      const foundTransition =
        this.form.value.sequenceState === '-1'
          ? undefined
          : this.selectedSequence.transitions.find(
              (transition) => transition.to.id === this.form.value.sequenceState
            )

      await this.sequence.upsertSeqAutoenrollmentPreference({
        id: this.selectedSequence.id,
        time: '00:00:00',
        timezone: this.context.user.timezone,
        offset: {
          ...this.form.value,
          sequenceState: undefined
        },
        transition: foundTransition ? foundTransition.id : undefined
      })

      this.dialogRef.close(true)
    } catch (error) {
      this.notifier.error(error)
    }
  }

  public useControl(controlName: 'dayOfWeek' | 'dayOfMonth' | 'fixed'): void {
    this.form.disable()
    this.form.get('sequenceState').enable()
    this.form.get(controlName).enable()
  }

  private createDaysOptions(): void {
    this.daysOfMonth = new Array(31).fill('').map((element, index) => ({
      value: index,
      viewValue: (index + 1).toString()
    }))
  }

  private createForm(): void {
    this.form = this.fb.group({
      dayOfWeek: [0],
      dayOfMonth: [1],
      fixed: [1],
      sequenceState: ['']
    })
  }
}
