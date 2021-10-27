import { Component, Input } from '@angular/core'

@Component({
  selector: 'app-menu-wellcore-ring',
  templateUrl: './wellcore-ring.component.html'
})
export class WellcoreRingComponent {
  @Input() blur: number = 0

  public now = Date.now() + Math.floor(Math.random() * 10000)
}
