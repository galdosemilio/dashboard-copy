import { Component, Input } from '@angular/core'

@Component({
  selector: 'ccr-poor-connection-icon',
  templateUrl: './poor-connection.component.html'
})
export class PoorConnectionIconComponent {
  @Input()
  fill = '#aba9a8'
  @Input()
  size = 24
}
