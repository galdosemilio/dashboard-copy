import { Component, OnInit } from '@angular/core'
import {
  StorefrontCart,
  StorefrontService
} from '@coachcare/storefront/services'
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy'
import { filter, first } from 'rxjs/operators'
import { CurrentAccount, NotifierService } from '@coachcare/common/services'
import {
  AccountAddress,
  AddressTypeId,
  AddressProvider,
  NamedEntity,
  SpreeProvider
} from '@coachcare/sdk'
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
import { StripeService } from 'ngx-stripe'
import { IAddress } from '@spree/storefront-api-v2-sdk/types/interfaces/attributes/Address'

type SpreeAddress = IAddress & { validate_address: boolean }
export type ShippingRate = NamedEntity & {
  shipping_method_id: string
  shipment: string
  selected: boolean
}

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
  public paymentMethodId: string
  public creditCardId: string
  public shippingAddress: AccountAddress
  public billingAddress: AccountAddress
  public shippingRates: ShippingRate[] = []
  public creditCardList: NamedEntity[] = []
  public errors: { [key: string]: { [key: string]: string[] } } = {}

  public get shippingDescription(): string {
    return this.cart?.shipment?.attributes?.public_metadata?.description || ''
  }

  public get totalDiscount(): string | null {
    return this.cart?.attributes?.adjustment_total === '0.0'
      ? null
      : this.cart?.attributes?.display_adjustment_total
  }
  public get totalMeals(): number {
    return this.cart?.lineItems?.reduce((acc, item) => acc + item.meals, 0)
  }

  public get totalItems(): number {
    return (
      this.cart?.lineItems?.reduce(
        (acc, item) => acc + item.attributes.quantity,
        0
      ) ?? 0
    )
  }

  public get hasPoBoxError(): boolean {
    return (
      (this.cart?.shipment?.attributes?.public_metadata?.validate_po_box &&
        this.cart?.shippingAddress?.attributes?.address_type === 'po_box') ||
      (this.cart?.shipment?.attributes?.public_metadata?.validate_po_box &&
        this.shippingAddress?.type.id == AddressTypeId.POBox)
    )
  }

  public get hasErrors(): boolean {
    return Object.keys(this.errors).length > 0 || this.hasPoBoxError
  }

  constructor(
    private storefront: StorefrontService,
    private notifier: NotifierService,
    private addressProvider: AddressProvider,
    private dialog: MatDialog,
    private router: Router,
    private route: ActivatedRoute,
    private spree: SpreeProvider,
    private stripeService: StripeService
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
        void this.processCheckout()
      })

    this.storefront.cart$
      .pipe(
        untilDestroyed(this),
        filter((res) => !!res)
      )
      .subscribe((res) => (this.cart = res))
  }

  private async processCheckout() {
    this.user = this.storefront.storefrontUserService.user
    this.isLoading = true

    await this.resolveAccountAddresses()
    await this.getFirstPaymentMethod()
    await this.resolvePaymentMethod()

    this.isLoading = false
  }

  public async resolveAccountAddresses(validateAddress: boolean = true) {
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
      await this.setAddresses(validateAddress)
      await this.getShippingRates()
    } catch (err) {
      this.notifier.error(err)
    } finally {
      this.isLoading = false
    }
  }

  public async resolvePaymentMethod() {
    try {
      const res = await this.spree.getCreditCards()

      const creditCards = res.credit_cards.filter((item) => item.source_id)

      this.creditCardList = creditCards.map((item) => ({
        id: item.source_id.toString(),
        name: `${item.brand} ***${item.last4} ${item.exp_month}/${item.exp_year}`
      }))

      const defaultCard =
        creditCards.find((item) => item.default_source) ||
        creditCards[creditCards.length - 1]

      if (!this.cart.creditCard && defaultCard) {
        this.onSelectCreditCard(defaultCard.source_id.toString())
      } else if (this.cart.creditCard) {
        this.onSelectCreditCard(this.cart.creditCard.id.toString())
      }
    } catch (err) {
      this.notifier.error(err?.response?.data?.message ?? err)
    }
  }

  public onSelectCreditCard(creditCardId: string) {
    this.creditCardId = creditCardId
  }

  public openPaymentMethod() {
    this.dialog
      .open(StorefrontPaymentMethodDialog, {
        width: '60vw',
        maxWidth: '500px'
      })
      .afterClosed()
      .pipe(filter((token) => token))
      .subscribe((token) => this.addPaymentMethod(token))
  }

  public async addPaymentMethod(token: Token) {
    this.isLoading = true

    try {
      await this.storefront.checkout({
        order: {
          payments_attributes: [
            {
              payment_method_id: this.paymentMethodId,
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

      const confirmData = await this.spree.getPaymentConfirmationIntentData()
      const confirmCardPaymentResponse = await this.stripeService
        .confirmCardPayment(confirmData.client_secret)
        .toPromise()

      await this.spree.verifyPaymentConfirmationIntentResponse({
        response: confirmCardPaymentResponse
      })

      await this.resolvePaymentMethod()
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
          address: this.shippingAddress,
          otherAddress: this.shippingAddress,
          invalidAddress: this.errors.hasOwnProperty('ship_address'),
          label: AddressLabelType.SHIPPING,
          user: this.user
        },
        width: '60vw',
        maxWidth: '800px'
      })
      .afterClosed()
      .pipe(filter((address) => address))
      .subscribe(() => this.resolveAccountAddresses(false))
  }

  public async onSelectShippingRate(rateId: string) {
    const selectedShippingRate: ShippingRate = this.shippingRates.find(
      (s) => s.id === rateId
    )
    this.isLoading = true
    try {
      await this.storefront.checkout({
        order: {
          shipments_attributes: [
            {
              id: selectedShippingRate.shipment,
              selected_shipping_rate_id: rateId
            }
          ]
        }
      })
      await this.storefront.advance()
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
          address: this.billingAddress,
          otherAddress: this.shippingAddress,
          label: AddressLabelType.BILLING,
          user: this.user
        },
        width: '60vw',
        maxWidth: '800px'
      })
      .afterClosed()
      .pipe(filter((address) => address))
      .subscribe(() => this.resolveAccountAddresses(false))
  }

  public async onCompleteOrder() {
    this.isLoading = true

    try {
      await this.storefront.addPayment({
        payment_method_id: this.paymentMethodId,
        source_id: this.creditCardId
      })
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

  private async getShippingRates() {
    if (!this.shippingAddress) {
      return
    }

    this.shippingRates = await this.storefront.getShippingRates()
    const selected = this.shippingRates.find((s) => s.selected)
    await this.onSelectShippingRate(selected.id)
  }

  private async setAddresses(validateAddress: boolean = true) {
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
        country_iso: this.shippingAddress.country.id,
        validate_address: validateAddress
      } as SpreeAddress
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
        country_iso: this.billingAddress.country.id,
        validate_address: false
      } as SpreeAddress
    }

    try {
      this.errors = {}
      await this.storefront.checkout(data)
    } catch (err) {
      this.errors = err.errors
      this.notifier.error(err.summary)
    }
  }

  private async getFirstPaymentMethod() {
    this.isLoading = true

    try {
      const paymentMethods = await this.storefront.getPaymentMethods()
      const paymentMethod = paymentMethods.data[0]

      if (!paymentMethod) {
        throw new Error(_('ERROR.PAYMENT_METHOD_NOT_FOUND'))
      }

      this.paymentMethodId = paymentMethod.id
    } catch (err) {
      this.notifier.error(err)
    } finally {
      this.isLoading = false
    }
  }
}
