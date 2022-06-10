import { Component, OnInit } from '@angular/core'
import { ActivatedRoute, Router } from '@angular/router'
import {
  StorefrontCart,
  StorefrontService
} from '@coachcare/storefront/services'
import { UntilDestroy } from '@ngneat/until-destroy'

@UntilDestroy()
@Component({
  selector: 'app-storefront-order-complete',
  templateUrl: './storefront-order-complete.component.html',
  styleUrls: ['./storefront-order-complete.component.scss']
})
export class StorefrontOrderCompleteComponent implements OnInit {
  public cart: StorefrontCart

  constructor(
    private storefront: StorefrontService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    if (!this.storefront.cart?.isComplete) {
      return this.router.navigate(['../../'], {
        relativeTo: this.route,
        queryParamsHandling: 'merge'
      })
    }
    this.cart = this.storefront.cart
  }
}
