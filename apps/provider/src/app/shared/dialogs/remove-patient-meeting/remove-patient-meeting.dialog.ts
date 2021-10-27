import { Component, Inject, OnInit } from '@angular/core'
import { MAT_DIALOG_DATA, MatDialogRef } from '@coachcare/material'
import { FetchMeetingResponse } from '@coachcare/sdk'

interface RemovePatientMeetingDialogProps {
  firstName: string
  lastName: string
  meetings: FetchMeetingResponse[]
}

@Component({
  selector: 'app-remove-patient-meeting-dialog',
  templateUrl: './remove-patient-meeting.dialog.html',
  styleUrls: ['./remove-patient-meeting.dialog.scss'],
  host: {
    class: 'ccr-dialog'
  }
})
export class RemovePatientMeetingDialog implements OnInit {
  public meetings: FetchMeetingResponse[] = []
  public hasMoreMeetings = false

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: RemovePatientMeetingDialogProps,
    private dialog: MatDialogRef<RemovePatientMeetingDialog>
  ) {}

  ngOnInit(): void {
    this.hasMoreMeetings = this.data.meetings.length > 3
    this.meetings = this.data.meetings.slice(0, 3)
  }

  onContinue(): void {
    this.dialog.close(true)
  }
}
