import { Component, Input } from '@angular/core'

@Component({
  selector: 'ccr-rpm-calendar-icon',
  templateUrl: './rpm-calendar-icon.component.html',
  styleUrls: ['./rpm-calendar-icon.component.scss']
})
export class RPMCalendarIconComponent {
  @Input()
  text = ''

  @Input()
  size = 24

  @Input()
  completed = false
}
