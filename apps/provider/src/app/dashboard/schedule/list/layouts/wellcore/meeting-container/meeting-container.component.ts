import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core'
import { ViewMeetingDialog } from '@app/shared/components/schedule'
import { Meeting } from '@app/shared/model/meeting'
import { MatDialog } from '@coachcare/material'
import { Store } from '@ngrx/store'
import { CCRConfig } from '@app/config'
import { TogglePanel } from '@app/layout/store/layout'

@Component({
  selector: 'ccr-wellcore-meeting-container',
  templateUrl: './meeting-container.component.html',
  styleUrls: ['./meeting-container.component.scss']
})
export class WellcoreMeetingContainer implements OnInit {
  @Input() disabled = false
  @Input() meeting?: Meeting

  @Output() onRefresh$: EventEmitter<void> = new EventEmitter<void>()

  constructor(private dialog: MatDialog, private store: Store<CCRConfig>) {}

  public ngOnInit(): void {}

  public onReschedule(): void {
    this.dialog
      .open(ViewMeetingDialog, {
        data: { meeting: this.meeting },
        width: '80vw',
        panelClass: 'ccr-full-dialog',
        disableClose: true
      })
      .afterClosed()
      .subscribe(() => this.onRefresh$.emit())
  }

  public onSchedule(): void {
    this.store.dispatch(new TogglePanel())
  }
}
