import { Component, Input } from '@angular/core'

@Component({
  selector: 'storefront-notice',
  templateUrl: './notice.component.html',
  styleUrls: ['./notice.component.scss']
})
export class StorefrontNoticeComponent {
  @Input() message: string = ''
}
