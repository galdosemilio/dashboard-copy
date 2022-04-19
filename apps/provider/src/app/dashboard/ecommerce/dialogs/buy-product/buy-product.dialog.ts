import { Component, Inject, OnInit } from '@angular/core'
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog'
import { ContextService, NotifierService } from '@app/service'
import { _ } from '@app/shared/utils'
import { AddressLabelType } from '@coachcare/common/model'
import {
  AccountAddress,
  AddressProvider,
  EcommerceCreateTokenResponse,
  SpreeCreditCardEntry,
  SpreeProvider
} from '@coachcare/sdk'
import { Client, makeClient } from '@spree/storefront-api-v2-sdk'
import { DeviceDetectorService } from 'ngx-device-detector'
import { EcommerceProduct, OrderSummary } from '../../model'

interface BuyProductDialogProps {
  product: EcommerceProduct
  tokenRes: EcommerceCreateTokenResponse
}

@Component({
  selector: 'app-ecommerce-buy-product-dialog',
  templateUrl: './buy-product.dialog.html',
  styleUrls: ['./buy-product.dialog.scss'],
  host: { class: 'ccr-dialog force-wellcore-layout' }
})
export class BuyProductDialog implements OnInit {
  public isLoading = false
  public isMobile = false
  public orderSummary: OrderSummary

  private billingAddress: AccountAddress
  private paymentMethod: Partial<SpreeCreditCardEntry>
  private product: EcommerceProduct
  private spree: Client
  private shippingAddress: AccountAddress
  private tokenRes: EcommerceCreateTokenResponse

  constructor(
    private addressProvider: AddressProvider,
    private context: ContextService,
    @Inject(MAT_DIALOG_DATA) private data: BuyProductDialogProps,
    private deviceDetector: DeviceDetectorService,
    private dialogRef: MatDialogRef<BuyProductDialog>,
    private notifier: NotifierService,
    private spreeProvider: SpreeProvider
  ) {}

  public async ngOnInit(): Promise<void> {
    this.isMobile = this.deviceDetector.isMobile()
    this.product = this.data.product
    this.tokenRes = this.data.tokenRes

    this.spreeProvider.setBaseApiOptions({
      baseUrl: this.context.organization.preferences?.storeUrl,
      headers: { Authorization: `Bearer ${this.tokenRes.token}` }
    })

    this.createSpreeClient()
    await this.fetchUserAddresses()
    await this.preloadCart()
  }

  public async cancelOrder(): Promise<void> {
    try {
      this.isLoading = true
      await this.spree.cart.emptyCart({ bearerToken: this.tokenRes.token })
      this.dialogRef.close()
    } catch (error) {
      this.notifier.error(error)
    } finally {
      this.isLoading = false
    }
  }

  public async completeOrder(): Promise<void> {
    try {
      this.isLoading = true
      await this.spree.checkout.complete({ bearerToken: this.tokenRes.token })
      this.notifier.success(_('NOTIFY.SUCCESS.ORDER_COMPLETED_SUCCESSFULLY'))
      this.dialogRef.close()
    } catch (error) {
      this.notifier.error(error)
    } finally {
      this.isLoading = false
    }
  }

  private async addProduct(
    token: string,
    product: EcommerceProduct
  ): Promise<void> {
    try {
      const addProductRes = await this.spree.cart.addItem(
        { bearerToken: token },
        { variant_id: product.id, quantity: 1 }
      )

      if (addProductRes.isSuccess()) {
        return
      }

      throw new Error(
        `Spree product add error. Reason: ${addProductRes.fail().message}`
      )
    } catch (error) {
      this.notifier.error(error)
    }
  }

  private async createCart(token: string): Promise<void> {
    try {
      const createCartRes = await this.spree.cart.create({ bearerToken: token })

      if (createCartRes.isFail()) {
        throw new Error(
          `Spree cart creation error. Reason ${createCartRes.fail().message}`
        )
      }

      const emptyCartRes = await this.spree.cart.emptyCart({
        bearerToken: this.tokenRes.token
      })

      if (emptyCartRes.isFail()) {
        throw new Error(
          `Spree cart clearing error. Reason: ${emptyCartRes.fail().message}`
        )
      }
    } catch (error) {
      this.notifier.error(error)
    }
  }

  private createSpreeClient(): void {
    this.spree = makeClient({
      host: this.context.organization.preferences?.storeUrl
    })
  }

  private async fetchUserAddresses(): Promise<void> {
    try {
      const addresses = await this.addressProvider.getAddressList({
        account: this.context.user.id,
        limit: 'all'
      })

      this.shippingAddress = addresses.data.find((entry) =>
        entry.labels.find((label) => label.id === AddressLabelType.SHIPPING)
      )

      this.billingAddress = addresses.data.find((entry) =>
        entry.labels.find((label) => label.id === AddressLabelType.BILLING)
      )
    } catch (error) {
      this.notifier.error(error)
    }
  }

  private async preloadCart(): Promise<void> {
    const token = this.tokenRes.token
    const product = this.product

    await this.createCart(token)
    await this.addProduct(token, product)
    await this.setAddresses(token)
    await this.setPaymentMethod(token)
    await this.selectShippingMethod(token)

    const res = await this.spree.checkout.orderUpdate(
      { bearerToken: token },
      {}
    )

    this.orderSummary = new OrderSummary({
      order: res.success(),
      shippingAddress: this.shippingAddress,
      billingAddress: this.billingAddress,
      paymentMethod: this.paymentMethod,
      products: [this.product]
    })
  }

  private async setAddresses(token: string): Promise<void> {
    try {
      const [billFirstName, billLastName] = this.billingAddress.name.split(' ')

      const billAddressRes = await this.spree.checkout.orderUpdate(
        { bearerToken: token },
        {
          order: {
            bill_address_attributes: {
              firstname: billFirstName,
              lastname: billLastName,
              address1: this.billingAddress.address1,
              address2: this.billingAddress.address2 || undefined,
              city: this.billingAddress.city,
              phone: this.context.user.phone,
              zipcode: this.billingAddress.postalCode,
              state_name: this.billingAddress.stateProvince,
              country_iso: this.billingAddress.country.id
            }
          }
        }
      )

      if (billAddressRes.isFail()) {
        throw new Error(
          `Spree billing address error. Reason: ${
            billAddressRes.fail().message
          }`
        )
      }

      const [shipFistName, shipLastName] = this.shippingAddress.name.split(' ')

      const shipAddressRes = await this.spree.checkout.orderUpdate(
        { bearerToken: token },
        {
          order: {
            ship_address_attributes: {
              firstname: shipFistName,
              lastname: shipLastName,
              address1: this.shippingAddress.address1,
              address2: this.shippingAddress.address2 || undefined,
              city: this.shippingAddress.city,
              phone: this.context.user.phone,
              zipcode: this.shippingAddress.postalCode,
              state_name: this.shippingAddress.stateProvince,
              country_iso: this.shippingAddress.country.id
            }
          }
        }
      )

      if (shipAddressRes.isFail()) {
        throw new Error(
          `Spree shipping address error. Reason: ${
            shipAddressRes.fail().message
          }`
        )
      }
    } catch (error) {
      this.notifier.error(error)
    }
  }

  private async setPaymentMethod(token: string): Promise<void> {
    try {
      const paymentMethodsRes = await this.spree.checkout.paymentMethods({
        bearerToken: token
      })

      if (paymentMethodsRes.isFail()) {
        throw new Error(
          `Spree error fetching payment methods. Reason: ${
            paymentMethodsRes.fail().message
          }`
        )
      }

      if (paymentMethodsRes.success().data.length <= 0) {
        throw new Error(
          `There are no payment methods set up. Please contact support and show them this error message.`
        )
      }

      const creditCardsRes = await this.spree.account.creditCardsList({
        bearerToken: token
      })

      this.paymentMethod = creditCardsRes.success().data[0]

      const selPaymentMethodRes = await this.spree.checkout.addPayment(
        { bearerToken: token },
        {
          payment_method_id: paymentMethodsRes.success().data.shift().id,
          source_id: creditCardsRes.success().data[0].id
        }
      )

      if (selPaymentMethodRes.isFail()) {
        throw new Error(
          `Spree error setting payment method. Reason: ${
            selPaymentMethodRes.fail().message
          }`
        )
      }
    } catch (error) {
      this.notifier.error(error)
    }
  }

  private async selectShippingMethod(token): Promise<void> {
    try {
      const shipRatesRes = await this.spree.checkout.shippingRates({
        bearerToken: token
      })

      if (shipRatesRes.isFail()) {
        throw new Error(
          `Spree shipping rates error. Reason: ${shipRatesRes.fail().message}`
        )
      }

      if (shipRatesRes.success().included?.length <= 0) {
        throw new Error(
          `The shipping rate list is empty. Please contact an administrator and show them this error message`
        )
      }

      const selectShipMethodRes =
        await this.spree.checkout.selectShippingMethod(
          { bearerToken: token },
          {
            shipping_method_id:
              shipRatesRes.success().included[0]?.attributes.shipping_method_id
          }
        )

      if (selectShipMethodRes.isFail()) {
        throw new Error(
          `Spree shipping method selection error. Reason: ${
            selectShipMethodRes.fail().message
          }`
        )
      }
    } catch (error) {
      this.notifier.error(error)
    }
  }
}
