import { Component, Input } from '@angular/core'

@Component({
  selector: 'ccr-missing-data-icon',
  templateUrl: './missing-data-icon.component.html'
})
export class MissingDataIconComponent {
  @Input()
  fill = '#aba9a8'
  @Input()
  size = 24
}
