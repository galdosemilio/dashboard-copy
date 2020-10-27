import { Component, Input } from '@angular/core';

@Component({
  selector: 'ccr-rpm-chat-icon',
  templateUrl: './rpm-chat-icon.component.html',
  styleUrls: ['./rpm-chat-icon.component.scss']
})
export class RPMChatIconComponent {
  @Input()
  size: number = 24;

  @Input()
  text: string = '';
}
