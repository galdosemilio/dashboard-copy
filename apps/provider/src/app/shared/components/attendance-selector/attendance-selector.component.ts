import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output
} from '@angular/core'
import { FormBuilder, FormGroup } from '@angular/forms'
import { Meeting } from '@app/dashboard/schedule/models'
import { NotifierService } from '@app/service'
import {
  AttendanceStatusAssociation,
  AttendanceStatusEntry
} from '@coachcare/sdk'
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy'
import { Schedule } from '@coachcare/sdk'

@UntilDestroy()
@Component({
  selector: 'ccr-attendance-selector',
  templateUrl: './attendance-selector.component.html',
  styleUrls: ['./attendance-selector.component.scss']
})
export class CcrAttendanceSelectorComponent implements OnDestroy, OnInit {
  @Input() attendanceStatus: AttendanceStatusEntry
  @Input() meeting: Meeting

  @Output()
  change: EventEmitter<AttendanceStatusEntry> = new EventEmitter<AttendanceStatusEntry>()

  attendanceStatusOptions: AttendanceStatusEntry[] = []
  form: FormGroup

  constructor(
    private fb: FormBuilder,
    private notifier: NotifierService,
    private schedule: Schedule
  ) {}

  ngOnDestroy(): void {}

  ngOnInit(): void {
    this.createForm()

    if (this.meeting) {
      this.fetchAttendanceStatusOptions()
    }
  }

  private createForm() {
    this.form = this.fb.group({
      attendanceStatus: ['']
    })

    this.form.valueChanges.pipe(untilDestroyed(this)).subscribe((controls) => {
      if (controls.attendanceStatus) {
        const attendanceStatus = this.attendanceStatusOptions.find(
          (element) => element.id === controls.attendanceStatus
        )
        if (attendanceStatus) {
          this.change.next(attendanceStatus)
        }
      }
    })

    if (this.attendanceStatus) {
      this.form.patchValue({ attendanceStatus: this.attendanceStatus.id })
    }
  }

  private async fetchAttendanceStatusOptions() {
    try {
      const assoc: AttendanceStatusAssociation[] = (
        await this.schedule.fetchAllAttendanceStatusAssociations({
          organization: this.meeting.organization.id
        })
      ).data

      this.attendanceStatusOptions = assoc
        .filter((element) => element.status === 'active')
        .map((element) => element.attendanceStatus)
    } catch (error) {
      this.notifier.error(error)
    }
  }
}
