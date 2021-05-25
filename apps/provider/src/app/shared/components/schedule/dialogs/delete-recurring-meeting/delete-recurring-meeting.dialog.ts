import { Component, Inject, OnInit } from '@angular/core'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { MAT_DIALOG_DATA, MatDialogRef } from '@coachcare/material'
import { DeleteRecurringMeetingRequest } from '@coachcare/sdk'
import * as moment from 'moment'
import { Meeting } from '@app/shared/model'

interface DeleteRecurringMeetingDialogProps {
  meeting: Meeting
}

@Component({
  selector: 'app-delete-recurring-meeting-dialog',
  templateUrl: './delete-recurring-meeting.dialog.html',
  host: { class: 'ccr-dialog' }
})
export class DeleteRecurringMeetingDialog implements OnInit {
  public form: FormGroup
  public meeting: Meeting
  public today: moment.Moment = moment().startOf('day')

  constructor(
    @Inject(MAT_DIALOG_DATA) private data: DeleteRecurringMeetingDialogProps,
    private dialogRef: MatDialogRef<DeleteRecurringMeetingDialog>,
    private fb: FormBuilder
  ) {}

  public ngOnInit(): void {
    this.createForm()

    this.meeting = this.data.meeting
  }

  public onSubmit(): void {
    const formValue = this.form.value
    this.dialogRef.close({
      deleteMode: formValue.deleteMode,
      query: {
        id: this.meeting.id,
        after:
          formValue.deleteMode === 'recurringAfter'
            ? moment(formValue.after).startOf('day').toISOString()
            : undefined
      } as DeleteRecurringMeetingRequest
    })
  }

  private createForm(): void {
    this.form = this.fb.group({
      after: [moment().startOf('day'), Validators.required],
      deleteMode: ['recurring', Validators.required]
    })
  }
}
