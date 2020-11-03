import { Component, Input } from '@angular/core';

@Component({
  selector: 'ccr-signal-icon',
  templateUrl: './signal-icon.component.html'
})
export class SignalIconComponent {
  @Input()
  fill = '#aba9a8';
  @Input()
  size = 24;
}
