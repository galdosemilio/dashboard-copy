import { Component, Inject, OnInit } from '@angular/core'
import { MAT_DIALOG_DATA, MatDialog } from '@coachcare/material'
import { Meeting } from '../../models'
import { ViewMeetingDialog } from '../view-meeting'

interface ViewAllMeetingsDialogProps {
  meetings: Meeting[]
  time: Date
}

@Component({
  selector: 'app-view-all-meetings-dialog',
  templateUrl: './view-all-meetings.dialog.html',
  styleUrls: ['./view-all-meetings.dialog.scss'],
  host: { class: 'ccr-dialog' }
})
export class ViewAllMeetingsDialog implements OnInit {
  public meetings: Meeting[]
  public time: Date

  constructor(
    @Inject(MAT_DIALOG_DATA) private data: ViewAllMeetingsDialogProps,
    private dialog: MatDialog
  ) {}

  public ngOnInit(): void {
    this.meetings = this.data.meetings
    this.time = this.data.time
  }

  public viewMeeting(meeting: Meeting) {
    this.dialog.open(ViewMeetingDialog, {
      data: { meeting: meeting },
      width: '80vw',
      panelClass: 'ccr-full-dialog',
      disableClose: true
    })
  }
}
