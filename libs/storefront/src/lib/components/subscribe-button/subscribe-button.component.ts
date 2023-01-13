import { Component } from '@angular/core'
import { StorefrontService } from '@coachcare/storefront/services'
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy'
import { combineLatest, filter } from 'rxjs'

@UntilDestroy()
@Component({
  selector: 'storefront-subscribe-button',
  templateUrl: './subscribe-button.component.html'
})
export class StorefrontSubscribeButtonComponent {
  public planId: string
  public isLoading = false
  public subscribed = false
  constructor(private storefront: StorefrontService) {}

  ngOnInit(): void {
    combineLatest([this.storefront.subscriptions$, this.storefront.store$])
      .pipe(
        untilDestroyed(this),
        filter(([subs, store]) => !!subs && !!store)
      )
      .subscribe(([subs, store]) => {
        this.planId = store?.public_metadata?.subscription_id
        this.subscribed = subs.some((sub) => {
          return sub.processorPlan === this.planId
        })
      })
  }

  public async onSubscribe() {
    this.isLoading = true
    const response = await this.storefront.createStripeCheckoutSubscription(
      this.planId,
      `${window.location.origin}/storefront`
    )
    window.location.href = response.url
  }

  public async onManageSubscription() {
    this.isLoading = true
    const response = await this.storefront.createStripeCustomerPortal(
      `${window.location.origin}/storefront`
    )
    window.location.href = response.url
  }
}
