import { Component, Input } from '@angular/core'
import { MatStepper } from '@coachcare/material'
import { OrderAttr } from '@spree/storefront-api-v2-sdk/types/interfaces/Order'
import { ProductAttr } from '@spree/storefront-api-v2-sdk/types/interfaces/Product'
import { CheckoutData } from '..'

@Component({
  selector: 'ccr-wellcore-review-order',
  templateUrl: './review-order.component.html',
  styleUrls: ['./review-order.component.scss']
})
export class WellcoreReviewOrderComponent {
  @Input() cartInfo: OrderAttr
  @Input() cartItems: ProductAttr[] = []
  @Input() checkoutData: CheckoutData
  @Input() stepper: MatStepper

  public goToStep(index: number): void {
    this.stepper.selectedIndex = index
  }
}
