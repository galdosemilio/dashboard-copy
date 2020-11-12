import { Component, Input } from '@angular/core'

@Component({
  selector: 'ccr-icon-scale',
  templateUrl: './scale-icon.component.html'
})
export class ScaleIconComponent {
  @Input() fill: string
  @Input() size = 24

  constructor() {}
}
