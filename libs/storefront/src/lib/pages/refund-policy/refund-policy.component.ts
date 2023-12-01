import { Component, OnInit } from '@angular/core'
import {
  StorefrontCart,
  StorefrontService
} from '@coachcare/storefront/services'
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy'
import { filter } from 'rxjs/operators'

@UntilDestroy()
@Component({
  selector: 'storefront-refund-policy',
  templateUrl: './refund-policy.component.html',
  styleUrls: ['./refund-policy.component.scss']
})
export class StorefrontRefundPolicyComponent implements OnInit {
  public cart: StorefrontCart
  public refundPolicy: string

  constructor(private storefront: StorefrontService) {}

  ngOnInit() {
    this.storefront.store$
      .pipe(
        untilDestroyed(this),
        filter((s) => !!s)
      )
      .subscribe((s) => {
        this.refundPolicy = s.return_policy
      })
  }
}
