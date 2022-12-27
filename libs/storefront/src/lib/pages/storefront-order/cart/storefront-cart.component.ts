import { Component, OnInit } from '@angular/core'
import {
  StorefrontCart,
  StorefrontCartLineItem,
  StorefrontService
} from '@coachcare/storefront/services'
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy'
import { filter } from 'rxjs/operators'
import { NotifierService } from '@coachcare/common/services'

@UntilDestroy()
@Component({
  selector: 'app-storefront-cart',
  templateUrl: './storefront-cart.component.html',
  styleUrls: ['./storefront-cart.component.scss']
})
export class StorefrontCartComponent implements OnInit {
  public cart: StorefrontCart
  public isLoading = false

  public get shippingDescription(): string {
    return this.cart?.shipment?.attributes?.public_metadata?.description || ''
  }

  public get totalDiscount(): string | null {
    return this.cart?.attributes?.adjustment_total === '0.0'
      ? null
      : this.cart?.attributes?.display_adjustment_total
  }

  constructor(
    private storefront: StorefrontService,
    private notifier: NotifierService
  ) {}

  ngOnInit(): void {
    this.storefront.cart$
      .pipe(
        untilDestroyed(this),
        filter((cart) => !!cart)
      )
      .subscribe((cart) => {
        this.cart = cart?.isComplete ? null : cart
      })
  }

  public async onChangeQuantity(itemId: string, quantity: number) {
    this.isLoading = true

    try {
      await this.storefront.updateCartItemQuantity(itemId, quantity)
    } catch (err) {
      this.notifier.error(err)
    } finally {
      this.isLoading = false
    }
  }
  public async onRemoveItem(itemId: string) {
    this.isLoading = true

    try {
      await this.storefront.removeItemFromCart(itemId)
    } catch (err) {
      this.notifier.error(err)
    } finally {
      this.isLoading = false
    }
  }

  public canChangeQuantity(lineItem: StorefrontCartLineItem) {
    return lineItem.attributes.quantity > 1
  }
}
