import { Component, Input } from '@angular/core'
import { ConfigService } from '@coachcare/common/services'

@Component({
  selector: 'ccr-icon-user',
  templateUrl: './user-icon.component.html'
})
export class UserIconComponent {
  @Input() fill: string
  @Input() size = 40

  constructor(private config: ConfigService) {
    this.fill = this.config.get('palette.contrast')
  }
}
