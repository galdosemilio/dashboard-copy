import { Component, Input } from '@angular/core'
import { MatStepper } from '@coachcare/material'
import { CheckoutData } from '..'

@Component({
  selector: 'ccr-wellcore-review-order',
  templateUrl: './review-order.component.html',
  styleUrls: ['./review-order.component.scss']
})
export class WellcoreReviewOrderComponent {
  @Input() checkoutData: CheckoutData
  @Input() stepper: MatStepper

  public goToStep(index: number): void {
    this.stepper.selectedIndex = index
  }
}
