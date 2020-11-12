import { Component, Input } from '@angular/core'
import { ConfigService } from '@coachcare/common/services'

@Component({
  selector: 'ccr-icon-search',
  templateUrl: './search-icon.component.html'
})
export class SearchIconComponent {
  @Input() fill: string
  @Input() size = 24
  @Input() stroke = 5

  constructor(private config: ConfigService) {
    this.fill = this.config.get('palette.text')
  }
}
