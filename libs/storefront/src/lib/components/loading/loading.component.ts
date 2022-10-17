import { Component, Input } from '@angular/core'

@Component({
  selector: 'storefront-loading',
  templateUrl: './loading.component.html',
  styleUrls: ['./loading.component.scss']
})
export class StorefrontLoadingComponent {
  @Input() isLoading: boolean = false
  @Input() withOverlay: boolean = false
}
