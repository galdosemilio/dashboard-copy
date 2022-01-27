import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output
} from '@angular/core'
import { Meeting } from '@app/shared/model/meeting'

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

  public triggerCancelEvent(): void {
    this.onCancel.emit()
  }
}
