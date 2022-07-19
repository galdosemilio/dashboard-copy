import { Component, OnInit } from '@angular/core'
import {
  StorefrontCart,
  StorefrontService
} from '@coachcare/storefront/services'
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy'
import { filter, first } from 'rxjs/operators'
import { CurrentAccount, NotifierService } from '@coachcare/common/services'
import { AccountAddress, AddressProvider, NamedEntity } from '@coachcare/sdk'
import { AddressLabelType } from '@coachcare/common/model'
import { MatDialog } from '@angular/material/dialog'
import {
  StorefrontAddressDialog,
  StorefrontPaymentMethodDialog
} from '@coachcare/storefront/dialogs'
import { _ } from '@coachcare/common/shared'
import { Token } from '@stripe/stripe-js'
import { ActivatedRoute, Router } from '@angular/router'
import { OrderUpdate } from '@spree/storefront-api-v2-sdk/types/interfaces/endpoints/CheckoutClass'

@UntilDestroy()
@Component({
  selector: 'app-storefront-checkout',
  templateUrl: './storefront-checkout.component.html',
  styleUrls: ['./storefront-checkout.component.scss']
})
export class StorefrontCheckoutComponent implements OnInit {
  public cart: StorefrontCart
  public isLoading = false
  public user: CurrentAccount
  public shippingAddress: AccountAddress
  public billingAddress: AccountAddress
  public shippingRates: NamedEntity[] = []

  constructor(
    private storefront: StorefrontService,
    private notifier: NotifierService,
    private addressProvider: AddressProvider,
    private dialog: MatDialog,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.storefront.cart$
      .pipe(
        untilDestroyed(this),
        filter((res) => !!res),
        first()
      )
      .subscribe((cart) => {
        if (cart.isComplete) {
          return this.router.navigate(['../../'], {
            relativeTo: this.route,
            queryParamsHandling: 'merge'
          })
        }
        this.processCheckout()
      })

    this.storefront.cart$
      .pipe(
        untilDestroyed(this),
        filter((res) => !!res)
      )
      .subscribe((res) => (this.cart = res))
  }

  private processCheckout() {
    this.user = this.storefront.storefrontUserService.user
    void this.resolveAccountAddresses()
  }

  public async resolveAccountAddresses() {
    this.isLoading = true

    try {
      const response = await this.addressProvider.getAddressList({
        account: this.user.id,
        limit: 'all'
      })

      this.shippingAddress = response.data.find((addressEntry) =>
        addressEntry.labels.some(
          (label) => label.id === AddressLabelType.SHIPPING
        )
      )

      this.billingAddress = response.data.find((addressEntry) =>
        addressEntry.labels.some(
          (label) => label.id === AddressLabelType.BILLING
        )
      )

      await this.setAddresses()
      await this.getShippingRates()
    } catch (err) {
      this.notifier.error(err)
    } finally {
      this.isLoading = false
    }
  }

  private async getShippingRates() {
    this.shippingRates = await this.storefront.getShippingRates()
  }

  private async setAddresses() {
    if (!this.shippingAddress && !this.billingAddress) {
      return
    }

    const data: OrderUpdate = {
      order: {}
    }

    if (this.shippingAddress) {
      data.order.ship_address_attributes = {
        firstname: this.user.firstName,
        lastname: this.user.lastName,
        phone: this.user.phone,
        address1: this.shippingAddress.address1,
        address2: this.shippingAddress.address2,
        city: this.shippingAddress.city,
        zipcode: this.shippingAddress.postalCode,
        state_name: this.shippingAddress.stateProvince,
        country_iso: this.shippingAddress.country.id
      }
    }

    if (this.billingAddress) {
      data.order.bill_address_attributes = {
        firstname: this.user.firstName,
        lastname: this.user.lastName,
        phone: this.user.phone,
        address1: this.billingAddress.address1,
        address2: this.billingAddress.address2,
        city: this.billingAddress.city,
        zipcode: this.billingAddress.postalCode,
        state_name: this.billingAddress.stateProvince,
        country_iso: this.billingAddress.country.id
      }
    }

    try {
      await this.storefront.checkout(data)
    } catch (err) {
      this.notifier.error(err)
    }
  }

  public openPaymentMethod() {
    this.dialog
      .open(StorefrontPaymentMethodDialog, {
        width: '60vw',
        maxWidth: '800px'
      })
      .afterClosed()
      .pipe(filter((token) => token))
      .subscribe((token) => this.addPaymentMethod(token))
  }

  public async addPaymentMethod(token: Token) {
    this.isLoading = true

    try {
      const paymentMethods = await this.storefront.getPaymentMethods()
      const paymentMethod = paymentMethods.data[0]

      if (!paymentMethod) {
        throw new Error(_('ERROR.PAYMENT_METHOD_NOT_FOUND'))
      }

      await this.storefront.checkout({
        order: {
          payments_attributes: [
            {
              payment_method_id: paymentMethod.id,
              source_attributes: {
                gateway_payment_profile_id: token.id,
                cc_type: token.type,
                last_digits: token.card.last4,
                month: token.card.exp_month.toString(),
                year: token.card.exp_year.toString(),
                name: token.card.name
              }
            }
          ]
        }
      })
    } catch (err) {
      this.notifier.error(err)
    } finally {
      this.isLoading = false
    }
  }

  public openChangeShippingAddress() {
    this.dialog
      .open(StorefrontAddressDialog, {
        data: {
          title: _('GLOBAL.SHIPPING_ADDRESS'),
          address: this.shippingAddress
        },
        width: '60vw',
        maxWidth: '800px'
      })
      .afterClosed()
      .pipe(filter((address) => address))
      .subscribe((address) =>
        this.createOrUpdateAddress(address, AddressLabelType.SHIPPING)
      )
  }

  public async onSelectShippingRate(rateId: string) {
    this.isLoading = true

    try {
      await this.storefront.checkout({
        order: {
          shipments_attributes: [
            {
              id: this.cart.shipmentId,
              selected_shipping_rate_id: rateId
            }
          ]
        }
      })
    } catch (err) {
      this.notifier.error(err)
    } finally {
      this.isLoading = false
    }
  }

  public openChangeBillingAddress() {
    this.dialog
      .open(StorefrontAddressDialog, {
        data: {
          title: _('GLOBAL.BILLING_ADDRESS'),
          address: this.billingAddress
        },
        width: '60vw',
        maxWidth: '800px'
      })
      .afterClosed()
      .pipe(filter((address) => address))
      .subscribe((address) =>
        this.createOrUpdateAddress(address, AddressLabelType.BILLING)
      )
  }

  private async createOrUpdateAddress(address, label: AddressLabelType) {
    this.isLoading = true
    const targetAddress =
      label === AddressLabelType.SHIPPING
        ? this.shippingAddress
        : this.billingAddress
    const otherAddress =
      label === AddressLabelType.SHIPPING
        ? this.billingAddress
        : this.shippingAddress
    try {
      if (targetAddress && targetAddress.id !== otherAddress?.id) {
        await this.addressProvider.updateAddress({
          account: this.user.id,
          id: targetAddress.id,
          name: `${this.user.firstName} ${this.user.lastName}`,
          address1: address.address1,
          address2: address.address2 ?? null,
          city: address.city,
          stateProvince: address.stateProvince,
          country: address.country,
          postalCode: address.postalCode,
          labels: [label]
        })
      } else {
        await this.addressProvider.createAddress({
          account: this.user.id,
          name: `${this.user.firstName} ${this.user.lastName}`,
          address1: address.address1,
          address2: address.address2 ?? undefined,
          city: address.city,
          stateProvince: address.stateProvince,
          country: address.country,
          postalCode: address.postalCode,
          labels: [label]
        })
      }

      await this.resolveAccountAddresses()
    } catch (err) {
      this.notifier.error(err)
    } finally {
      this.isLoading = false
    }
  }

  public async onCompleteOrder() {
    this.isLoading = true

    try {
      await this.storefront.checkoutComplete()
      await this.router.navigate(['../complete'], {
        relativeTo: this.route,
        queryParamsHandling: 'merge'
      })
    } catch (err) {
      this.notifier.error(err)
    } finally {
      this.isLoading = false
    }
  }
}
