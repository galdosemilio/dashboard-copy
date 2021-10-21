import { Component, Input, OnDestroy, OnInit } from '@angular/core'
import { CheckoutData } from '..'

@Component({
  selector: 'ccr-wellcore-review-order',
  templateUrl: './review-order.component.html',
  styleUrls: ['./review-order.component.scss']
})
export class WellcoreReviewOrderComponent implements OnInit, OnDestroy {
  @Input() checkoutData: CheckoutData

  constructor() {}

  ngOnInit() {}

  ngOnDestroy() {}
}
