import { Component, Input } from '@angular/core'
import { EcommerceProduct } from '@coachcare/common/model'
import { OrderAttr } from '@spree/storefront-api-v2-sdk/types/interfaces/Order'

@Component({
  selector: 'ccr-checkout-order-review',
  templateUrl: './order-review.component.html',
  styleUrls: ['./order-review.component.scss']
})
export class OrderReviewComponent {
  @Input() orderDetails: OrderAttr
  @Input() products: EcommerceProduct[] = []
}
