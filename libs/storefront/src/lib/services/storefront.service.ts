import { Injectable } from '@angular/core'
import {
  AccountIdentifier,
  EcommerceProvider,
  NamedEntity,
  SpreeProvider
} from '@coachcare/sdk'

import { Client, makeClient } from '@spree/storefront-api-v2-sdk'
import { BehaviorSubject } from 'rxjs'
import { ProductAttr } from '@spree/storefront-api-v2-sdk/types/interfaces/Product'
import { RelationType } from '@spree/storefront-api-v2-sdk/types/interfaces/Relationships'
import { TaxonAttr } from '@spree/storefront-api-v2-sdk/types/interfaces/Taxon'
import { JsonApiDocument } from '@spree/storefront-api-v2-sdk/types/interfaces/JsonApi'
import { orderBy } from 'lodash'
import { _ } from '@coachcare/backend/shared'
import { StorefrontUserService } from './storefront-user.service'
import { IToken } from '@spree/storefront-api-v2-sdk/types/interfaces/Token'
import {
  IOrderResult,
  OrderAttr
} from '@spree/storefront-api-v2-sdk/types/interfaces/Order'
import {
  AddPayment,
  OrderUpdate
} from '@spree/storefront-api-v2-sdk/types/interfaces/endpoints/CheckoutClass'

export interface StorefrontVariant {
  id: string
  backorderable: boolean
  compare_at_price: string
  currency: string
  depth: number
  display_compare_at_price: string
  display_price: string
  height: number
  in_stock: boolean
  is_master: boolean
  options_text: string
  price: string
  purchasable: boolean
  sku: string
  weight: string
  width: boolean
  optionValues: string[]
}

export interface StorefrontOptionValue {
  id: string
  name: string
  position: number
}

export interface StorefrontProductOption {
  id: string
  name: string
  position: number
  selected?: string
  values: StorefrontOptionValue[]
}

export interface StorefrontProduct extends ProductAttr {
  images: string[]
  variants: StorefrontVariant[]
  options: StorefrontProductOption[]
}

export interface StorefrontCategory extends TaxonAttr {
  images: string[]
}

export interface StorefrontCartLineItem extends JsonApiDocument {
  images: string[]
}

export interface StorefrontCart extends OrderAttr {
  lineItems: StorefrontCartLineItem[]
  shippingAddress?: JsonApiDocument
  billingAddress?: JsonApiDocument
  paymentMethod?: JsonApiDocument
  creditCard?: JsonApiDocument
  shipmentId?: string
  shppingRateId?: string
  isComplete?: boolean
}

interface SpreeError {
  serverResponse?: { status?: number }
  message: string
}

const SPREE_EXTERNAL_ID_NAME = 'Spree ID'
const cartIncludeFields =
  'line_items,variants,variants.images,variants.product,variants.product.images,billing_address,shipping_address,user,payments,payments.payment_method,payments.source,shipments,promotions'

@Injectable()
export class StorefrontService {
  private spree: Client
  private spreeToken: IToken
  public storeUrl: string
  public cart: StorefrontCart

  public cart$ = new BehaviorSubject<StorefrontCart | null>(null)
  public initialized$ = new BehaviorSubject<boolean>(false)
  public error$ = new BehaviorSubject<Error | null>(null)

  constructor(
    private accountIdentifier: AccountIdentifier,
    private ecommerce: EcommerceProvider,
    private spreeProvider: SpreeProvider,
    public storefrontUserService: StorefrontUserService
  ) {}

  public async init() {
    try {
      await this.storefrontUserService.init()

      if (!this.storefrontUserService.preferences?.storeUrl) {
        throw new Error(_('ERROR.STORE_NOT_AVAILABLE'))
      }

      this.storeUrl = this.storefrontUserService.preferences.storeUrl

      this.spree = makeClient({
        host: this.storeUrl
      })

      await this.loadSpreeAccount()
      await this.loadSpreeCart()

      this.spreeProvider.setBaseApiOptions(
        {
          baseUrl: this.storeUrl,
          headers: { Authorization: `Bearer ${this.spreeToken.bearerToken}` }
        },
        true
      )

      this.initialized$.next(true)
    } catch (err) {
      this.error$.next(err)
    }
  }

  private async loadSpreeAccount() {
    const accountIdentifiers = await this.accountIdentifier.fetchAll({
      account: this.storefrontUserService.user.id,
      organization: this.storefrontUserService.orgId
    })

    const spreeAccountIdentifier = accountIdentifiers.data.find(
      (entry) => entry.name === SPREE_EXTERNAL_ID_NAME
    )

    if (spreeAccountIdentifier?.id && spreeAccountIdentifier?.isActive) {
      return this.refreshSpreeAccessToken()
    }

    const password = this.generateRandomPassword()
    const spreeAccountResult = await this.spree.account.create({
      user: {
        email: this.storefrontUserService.user.email,
        password: password,
        password_confirmation: password
      }
    })

    if (spreeAccountResult.isFail()) {
      const error = spreeAccountResult.fail() as SpreeError

      if (error.serverResponse?.status === 422) {
        throw new Error(_('ERROR.SPREE_ACCOUNT_ALREDAY_EXISTS'))
      }

      throw new Error(error.message)
    }

    await this.accountIdentifier.add({
      account: this.storefrontUserService.user.id,
      organization: this.storefrontUserService.orgId,
      name: SPREE_EXTERNAL_ID_NAME,
      value: spreeAccountResult.success().data.id
    })

    await this.refreshSpreeAccessToken()
  }

  private async refreshSpreeAccessToken() {
    const spreeAccessTokenResponse = await this.ecommerce.createToken({
      account: this.storefrontUserService.user.id,
      organization: this.storefrontUserService.orgId
    })

    if (spreeAccessTokenResponse?.token) {
      this.spreeToken = {
        bearerToken: spreeAccessTokenResponse.token
      }
    }
  }

  public async getCategories(name?: string): Promise<StorefrontCategory[]> {
    const res = await this.spree.taxons.list({
      include: 'image',
      filter: {
        name
      }
    })

    if (res.isSuccess()) {
      const data = res.success()

      return data.data.map((category) => {
        const { images } = this.parseSpreeEntry(category, data.included)

        return {
          ...category,
          images
        }
      })
    }

    if (res.isFail()) {
      throw new Error(res.fail().message)
    }
  }

  public async getProducts(
    taxonId: string,
    name?: string
  ): Promise<StorefrontProduct[]> {
    const res = await this.spree.products.list(undefined, {
      include: 'images',
      filter: {
        name,
        taxons: taxonId
      }
    })

    if (res.isSuccess()) {
      const data = res.success()

      return data.data.map((product) => {
        const { images } = this.parseSpreeEntry(product, data.included)

        return {
          ...product,
          images,
          variants: [],
          options: []
        }
      })
    }

    if (res.isFail()) {
      throw new Error(res.fail().message)
    }
  }

  public async getProductSingle(productId: string): Promise<StorefrontProduct> {
    const res = await this.spree.products.show(productId, undefined, {
      include:
        'variants,variants.option_values,option_types,images,default_variant'
    })

    if (res.isSuccess()) {
      const response = res.success()
      const product = response.data
      const { images, variants, options } = this.parseSpreeEntry(
        product,
        response.included
      )

      return {
        ...product,
        images,
        variants,
        options
      }
    }

    if (res.isFail()) {
      throw new Error(res.fail().message)
    }
  }

  private async loadSpreeCart() {
    const res = await this.spree.cart.show(this.spreeToken, {
      include: cartIncludeFields
    })

    this.parseCartResult(res, true)
  }

  private async createCart() {
    const res = await this.spree.cart.create(this.spreeToken, {
      include: cartIncludeFields
    })

    this.parseCartResult(res, true)
  }

  public async addItemToCart(variantId: string, quantity: number) {
    if (!this.cart || this.cart.isComplete) {
      await this.createCart()
    }

    const res = await this.spree.cart.addItem(this.spreeToken, {
      variant_id: variantId,
      quantity,
      include: cartIncludeFields
    })

    this.parseCartResult(res)
  }

  public async updateCartItemQuantity(itemId: string, quantity: number) {
    const res = await this.spree.cart.setQuantity(this.spreeToken, {
      line_item_id: itemId,
      quantity,
      include: cartIncludeFields
    })

    this.parseCartResult(res)
  }

  public async removeItemFromCart(itemId: string) {
    const res = await this.spree.cart.removeItem(this.spreeToken, itemId, {
      include: cartIncludeFields
    })

    if (res.isFail()) {
      throw new Error(res.fail().message)
    }

    await this.loadSpreeCart()
  }

  public async getShippingRates() {
    const res = await this.spree.checkout.shippingRates(this.spreeToken)

    if (res.isFail()) {
      throw new Error(res.fail().message)
    }

    const data = res.success()

    const shipment = data.data.find(
      (item) =>
        (item.relationships.selected_shipping_rate?.data as RelationType)?.id
    )
    const shippingRateIds =
      (shipment?.relationships.shipping_rates.data as RelationType[]).map(
        (entry) => entry.id
      ) || []

    const shippingRates: NamedEntity[] = data.included
      .filter(
        (entry) =>
          entry.type === 'shipping_rate' && shippingRateIds.includes(entry.id)
      )
      .map((entry) => ({
        id: entry.id,
        name: `${entry.attributes.name} - ${entry.attributes.display_cost}`
      }))

    return shippingRates
  }

  public async checkout(params: OrderUpdate) {
    const res = await this.spree.checkout.orderUpdate(this.spreeToken, {
      ...params,
      include: cartIncludeFields
    })

    this.parseCartResult(res)
  }

  public async addPayment(params: AddPayment) {
    const res = await this.spree.checkout.addPayment(this.spreeToken, {
      ...params,
      include: cartIncludeFields
    })

    this.parseCartResult(res)
  }

  public async getCreditCards() {
    const res = await this.spree.account.creditCardsList(this.spreeToken)

    if (res.isFail()) {
      throw new Error(res.fail().message)
    }

    return res.success().data
  }

  public async checkoutComplete() {
    const res = await this.spree.checkout.complete(this.spreeToken, {
      include: cartIncludeFields
    })

    this.parseCartResult(res)
  }

  public async getPaymentMethods() {
    const res = await this.spree.checkout.paymentMethods(this.spreeToken)

    if (res.isFail()) {
      throw new Error(res.fail().message)
    }

    return res.success()
  }

  private parseCartResult(res: IOrderResult, silentFail = false) {
    if (res.isFail()) {
      if (silentFail) {
        return
      }

      throw new Error(res.fail().message)
    }

    const entry = res.success()
    const data = entry.data
    const lineItems = entry.included
      .filter((item) => item.type === 'line_item')
      .map((lineItem) => {
        const variant = entry.included.find(
          (item) =>
            item.type === 'variant' &&
            item.id === lineItem.relationships.variant?.data.id
        )
        const product = entry.included.find(
          (item) =>
            item.type === 'product' &&
            item.id === variant?.relationships.product?.data.id
        )

        const images = product
          ? this.getSpreeImages(product, entry.included)
          : []

        return {
          ...lineItem,
          images
        }
      })

    const shippingAddressId = Array.isArray(
      entry.data.relationships.shipping_address?.data
    )
      ? entry.data.relationships.shipping_address?.data[0].id
      : entry.data.relationships.shipping_address?.data?.id

    const billingAddressId = Array.isArray(
      entry.data.relationships.billing_address?.data
    )
      ? entry.data.relationships.billing_address?.data[0].id
      : entry.data.relationships.billing_address?.data?.id

    const shippingAddress = entry.included.find(
      (item) => item.type === 'address' && item.id === shippingAddressId
    )
    const billingAddress = entry.included.find(
      (item) => item.type === 'address' && item.id === billingAddressId
    )

    const shipment = entry.included.find(
      (item) =>
        item.type === 'shipment' &&
        item.relationships?.selected_shipping_rate?.data?.id
    )

    const paymentMethod = entry.included.find(
      (item) => item.type === 'payment_method'
    )
    const creditCards = entry.included.filter(
      (item) => item.type === 'credit_card'
    )

    this.cart = {
      ...data,
      lineItems,
      shippingAddress,
      billingAddress,
      paymentMethod,
      creditCard: creditCards[creditCards.length - 1],
      shipmentId: shipment?.id,
      shppingRateId: shipment?.relationships.selected_shipping_rate?.data?.id,
      isComplete: data.attributes.state === 'complete'
    }

    this.cart$.next(this.cart)
  }

  private getSpreeImages(
    entry: ProductAttr | TaxonAttr,
    included: JsonApiDocument[] = []
  ) {
    if (entry.relationships.image?.data) {
      const imageUrl = included.find(
        (item) =>
          item.id === (entry.relationships.image?.data as RelationType).id
      )?.attributes.original_url

      if (imageUrl) {
        return [this.storeUrl + imageUrl]
      }

      return []
    }

    return (entry.relationships.images?.data as RelationType[])
      .map((productImage) => {
        const imageUrl = included.find((item) => item.id === productImage.id)
          ?.attributes.original_url
        if (imageUrl) {
          return this.storeUrl + imageUrl
        }
      })
      .filter((image) => image)
  }

  private parseSpreeEntry(
    data: ProductAttr | TaxonAttr,
    included: JsonApiDocument[] = []
  ) {
    const images = this.getSpreeImages(data, included)

    const variants: StorefrontVariant[] =
      included
        ?.filter((entry) => entry.type === 'variant')
        .map((entry) => {
          const values = entry.relationships.option_values?.data
            ?.filter((item) => item.type === 'option_value')
            .map((item) => item.id)
          return {
            id: entry.id,
            ...entry.attributes,
            optionValues: values
          }
        }) || []

    const optionValues: StorefrontOptionValue[] = orderBy(
      included
        ?.filter((entry) => entry.type === 'option_value')
        .map((entry) => {
          return {
            id: entry.id,
            name: entry.attributes.name,
            position: entry.attributes.position
          }
        }) || [],
      ['position', 'asc']
    )

    const options: StorefrontProductOption[] = orderBy(
      included
        ?.filter((entry) => entry.type === 'option_type')
        .map((entry) => {
          const entryValueIds =
            entry.relationships.option_values?.data
              ?.filter((option) => option.type === 'option_value')
              .map((option) => option.id) || []

          const values = optionValues.filter((value) =>
            entryValueIds.includes(value.id)
          )
          return {
            id: entry.id,
            name: entry.attributes.name,
            position: entry.attributes.position,
            values,
            selected: values.length && values[0].id
          }
        }) || [],
      ['position', 'asc']
    )

    return {
      images,
      variants,
      options
    }
  }

  private generateRandomPassword(length = 16) {
    const characters =
      '0123456789abcdefghijklmnopqrstuvwxyz!@#$%^&*()-=_+[]{}|;:<>ABCDEFGHIJKLMNOPQRSTUVWXYZ'
    const randomBytes = new Uint8Array(length)
    crypto.getRandomValues(randomBytes)

    return Array.from(randomBytes)
      .map((b) => characters[b % characters.length])
      .join('')
  }
}
