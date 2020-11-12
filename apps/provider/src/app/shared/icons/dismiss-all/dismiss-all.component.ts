import { Component, Input } from '@angular/core'

@Component({
  selector: 'ccr-icon-dismiss-all',
  templateUrl: './dismiss-all.component.html',
  styles: [':host { display: block; }'],
  host: {
    class: 'ccr-icon'
  }
})
export class DismissAllIconComponent {
  @Input()
  fill = '#aba9a8'
  @Input()
  size = 24

  constructor() {}
}
