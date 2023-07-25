import { Component, OnInit, Inject } from '@angular/core'
import { FormGroup, FormControl, Validators } from '@angular/forms'
import { MeasurementBodytraceSyncProvider, SyncRequest } from '@coachcare/sdk'
import { MAT_DIALOG_DATA, MatDialogRef } from '@coachcare/material'
import { _ } from '@coachcare/backend/shared'
import * as moment from 'moment'
import { NotifierService } from '@coachcare/common/services'

interface Duration {
  label: string
  value: number
}

interface BodytraceSyncDialogData {
  id: string
}

@Component({
  selector: 'app-bodytrace-sync-dialog',
  templateUrl: './bodytrace-sync.dialog.html',
  styleUrls: ['./bodytrace-sync.dialog.scss']
})
export class BodytraceSyncDialog implements OnInit {
  public dateRangeForm: FormGroup
  public fromDate: moment.Moment
  public durationOptions: Duration[] = [
    { label: _('BOARD.DURATIONS.1_DAY'), value: 24 },
    { label: _('BOARD.DURATIONS.3_DAYS'), value: 3 * 24 },
    { label: _('BOARD.DURATIONS.1_WEEK'), value: 7 * 24 },
    { label: _('BOARD.DURATIONS.2_WEEKS'), value: 14 * 24 }
  ]
  private selectedDuration: number
  private endDate: moment.Moment

  constructor(
    private measurmentBodytrace: MeasurementBodytraceSyncProvider,
    private notifier: NotifierService,
    private dialogRef: MatDialogRef<BodytraceSyncDialog>,
    @Inject(MAT_DIALOG_DATA) public data: BodytraceSyncDialogData
  ) {}

  ngOnInit(): void {
    this.createForm()
  }

  public setDuration(duration: Duration) {
    const fromDate = moment().subtract(duration.value, 'hours')
    this.selectedDuration = duration.value
    this.dateRangeForm.get('fromDate').setValue(fromDate)
    this.setRange(fromDate.toDate())
  }

  public setRange(selectedDate: Date | null) {
    this.fromDate = moment(selectedDate).startOf('day')
    this.endDate = moment(this.fromDate)
      .add(this.selectedDuration, 'hours')
      .startOf('day')
  }

  public async onSync(): Promise<void> {
    try {
      const payload: SyncRequest = {
        device: this.data.id,
        start: this.fromDate.toISOString(),
        end: this.endDate.toISOString()
      }

      await this.measurmentBodytrace.sync(payload)
      this.notifier.success(_('NOTIFY.SUCCESS.MANUAL_SYNC'))
      this.dialogRef.close()
    } catch (error) {
      console.error(error)
      this.notifier.error(_('NOTIFY.ERROR.MANUAL_SYNC'))
    }
  }

  private createForm() {
    const fromDate = moment().subtract(2, 'weeks')
    this.dateRangeForm = new FormGroup({
      fromDate: new FormControl(fromDate, Validators.required),
      duration: new FormControl(this.durationOptions[3], Validators.required)
    })
    this.fromDate = fromDate.startOf('day')
    this.endDate = moment().startOf('day')
  }
}
