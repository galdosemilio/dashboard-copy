import { Component, OnInit } from '@angular/core'
import {
  ContextService,
  EventsService,
  NotifierService
} from '@coachcare/common/services'
import { Authentication } from '@coachcare/sdk'

@Component({
  selector: 'ccr-checkout-order-confirm',
  templateUrl: './order-confirm.component.html'
})
export class CheckoutOrderConfirmComponent implements OnInit {
  constructor(
    private authentication: Authentication,
    private bus: EventsService,
    public context: ContextService,
    private notifier: NotifierService
  ) {
    this.onRedirect = this.onRedirect.bind(this)
  }

  public ngOnInit(): void {
    this.subscribeToEvents()
  }

  private subscribeToEvents(): void {
    this.bus.register('checkout.redirection.start', this.onRedirect)
  }

  private async onRedirect(data): Promise<void> {
    let url = `${window.location.origin}/${
      data.actionButtonType === 'storefront' ? 'storefront' : 'provider'
    }`

    try {
      const res = await this.authentication.shopify({
        organization: this.context.organizationId
      })

      url = res.url
    } catch (error) {
      this.notifier.error(error)
    } finally {
      window.location.href = url
    }
  }
}
