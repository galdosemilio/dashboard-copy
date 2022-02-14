import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output
} from '@angular/core'
import { AttendeeEntity } from '@app/shared'
import { Meeting } from '@app/shared/model/meeting'
import { AccountType } from '@coachcare/sdk'
import { sortBy } from 'lodash'

@Component({
  selector: 'ccr-meeting-container',
  templateUrl: './meeting-container.component.html',
  styleUrls: ['./meeting-container.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CcrScheduleMeetingContainer {
  @Input() cancellable = false
  @Input() disabled = false
  @Input() meeting: Meeting

  @Output() onCancel: EventEmitter<void> = new EventEmitter<void>()

  get attendeeEntities(): AttendeeEntity[] {
    return sortBy(
      this.meeting.attendees,
      (attendee) => attendee.accountType.id,
      ['desc']
    ).map((attendee) => ({
      id: attendee.id,
      isProvider: Number(attendee.accountType.id) === AccountType.Provider,
      name: `${attendee.firstName} ${attendee.lastName}`
    }))
  }

  public triggerCancelEvent(): void {
    this.onCancel.emit()
  }
}
