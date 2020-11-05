import { Component, Input } from '@angular/core'

@Component({
  selector: 'ccr-rpm-clock-icon',
  templateUrl: './rpm-clock-icon.component.html',
  styleUrls: ['./rpm-clock-icon.component.scss']
})
export class RPMClockIconComponent {
  @Input()
  size = 24

  @Input()
  text = ''
}
