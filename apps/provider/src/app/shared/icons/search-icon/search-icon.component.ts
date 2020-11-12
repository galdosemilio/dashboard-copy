import { Component, Input } from '@angular/core'

@Component({
  selector: 'ccr-icon-search',
  templateUrl: './search-icon.component.html',
  host: {
    class: 'ccr-icon'
  }
})
export class SearchIconComponent {
  @Input()
  fill: string
  @Input()
  size = 24
  @Input()
  stroke = 5

  constructor() {}
}
