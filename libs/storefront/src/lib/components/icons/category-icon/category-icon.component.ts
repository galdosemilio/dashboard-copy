import { Component, Input } from '@angular/core'

@Component({
  selector: 'storefront-icon-category',
  templateUrl: './category-icon.component.html'
})
export class StorefrontCategoryIconComponent {
  @Input() size = 24
  @Input() fill: string
}
