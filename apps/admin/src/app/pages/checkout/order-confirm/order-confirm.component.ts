import { Component } from '@angular/core'
import { ContextService } from '@coachcare/common/services'

@Component({
  selector: 'ccr-checkout-order-confirm',
  templateUrl: './order-confirm.component.html'
})
export class CheckoutOrderConfirmComponent {
  constructor(public context: ContextService) {}
}
