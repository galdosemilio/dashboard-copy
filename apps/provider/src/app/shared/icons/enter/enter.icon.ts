import { Component, Input } from '@angular/core'

@Component({
  selector: 'ccr-enter-icon',
  templateUrl: './enter.icon.html',
  styles: [
    `
      svg {
        vertical-align: middle;
      }
    `
  ]
})
export class EnterIconComponent {
  @Input() fill = '#aba9a8'
  @Input() size = 24
}
