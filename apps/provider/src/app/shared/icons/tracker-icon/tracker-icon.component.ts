import { Component, Input } from '@angular/core'

@Component({
  selector: 'ccr-icon-tracker',
  templateUrl: './tracker-icon.component.html'
})
export class TrackerIconComponent {
  @Input() fill: string
  @Input() size = 24

  constructor() {}
}
