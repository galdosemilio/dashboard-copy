import { Component, EventEmitter, Input, Output } from '@angular/core'
import { MessageThread } from '../messages/messages.interfaces'

@Component({
  selector: 'ccr-messages-chat-info',
  templateUrl: './messages-chat-info.component.html',
  host: { class: 'ccr-messages' }
})
export class CcrMessagesChatInfoComponent {
  @Input() thread: MessageThread

  @Output() hideChatInfo: EventEmitter<void> = new EventEmitter<void>()

  public onHideChatInfo(): void {
    this.hideChatInfo.emit()
  }
}
