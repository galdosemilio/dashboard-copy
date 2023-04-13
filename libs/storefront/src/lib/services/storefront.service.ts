import { Inject, Injectable } from '@angular/core'
import { EcommerceProvider, SpreeProvider } from '@coachcare/sdk'
import { Client, makeClient } from '@spree/storefront-api-v2-sdk'
import { BehaviorSubject } from 'rxjs'
import { ProductAttr } from '@spree/storefront-api-v2-sdk/types/interfaces/Product'
import { RelationType } from '@spree/storefront-api-v2-sdk/types/interfaces/Relationships'
import { TaxonAttr } from '@spree/storefront-api-v2-sdk/types/interfaces/Taxon'
import { JsonApiDocument } from '@spree/storefront-api-v2-sdk/types/interfaces/JsonApi'
import { orderBy } from 'lodash'
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
import { AppEnvironment, APP_ENVIRONMENT } from '@coachcare/common/shared'
import { ShippingRate } from '../pages'
import { SpreeSubscription } from '@coachcare/sdk/dist/lib/providers/spree/responses/getSubscription.response'

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
  public_metadata?: {
    subscription_id?: string
  }
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

export interface StorefrontProduct extends Omit<ProductAttr, 'attributes'> {
  images: string[]
  variants: StorefrontVariant[]
  options: StorefrontProductOption[]
  attributes: ProductAttr['attributes'] & {
    public_metadata?: {
      subscription_id?: string
    }
  }
}

export interface CurrentSpreeStore extends SpreeStore {
  title?: string
  description?: string
  hero_image?: string
  public_metadata?: {
    company_url?: string
    company_url_label?: string
    subscription_id?: string
  }
}

export interface StorefrontCategory extends TaxonAttr {
  images: string[]
}

export interface StorefrontCartLineItem extends JsonApiDocument {
  meals: number
  images: string[]
}

export interface StorefrontPromotion {
  id: string
  type: string
  attributes: {
    amount: string
    code: string
    description: string
    display_amount: string
    name: string
  }
}

export interface StorefrontCart extends OrderAttr {
  lineItems: StorefrontCartLineItem[]
  shippingAddress?: JsonApiDocument
  billingAddress?: JsonApiDocument
  paymentMethod?: JsonApiDocument
  creditCard?: JsonApiDocument
  shipment?: JsonApiDocument
  shipmentId?: string
  shppingRateId?: string
  isComplete?: boolean
  promotion?: StorefrontPromotion
}

interface SpreeError {
  serverResponse?: { status?: number }
  message: string
  errors?: { [key: string]: { [key: string]: string[] } }
  summary?: string
}

interface StoreSettingsEntry {
  digital_asset_authorized_clicks?: number
  digital_asset_authorized_days?: number
  digital_asset_link_expire_time?: number
  limit_digital_download_count?: boolean
  limit_digital_download_days?: boolean
}

interface SpreeStore {
  address?: string
  contact_phone?: string
  customer_support_email?: string
  default?: boolean
  default_country_id?: string
  default_currency?: string
  default_locale?: string
  description?: string
  facebook?: string
  favicon_path?: string
  hero_image?: string
  instagram?: string
  meta_description?: string
  meta_keywords?: string
  name?: string
  seo_title?: string
  settings?: StoreSettingsEntry
  supported_currencies?: string
  supported_locales?: string
  twitter?: string
  url?: string
  public_metadata?: {
    company_url?: string
    company_url_label?: string
    subscription_id?: string
  }
}

export const SPREE_EXTERNAL_ID_NAME = 'Spree ID'
const cartIncludeFields =
  'line_items,variants,variants.images,variants.product,variants.product.images,billing_address,shipping_address,user,payments,payments.payment_method,payments.source,shipments,promotions'

@Injectable()
export class StorefrontService {
  private spree: Client
  private spreeToken: IToken
  public storeUrl: string
  public cart: StorefrontCart

  public store$ = new BehaviorSubject<SpreeStore | null>(null)
  public cart$ = new BehaviorSubject<StorefrontCart | null>(null)
  public subscriptions$ = new BehaviorSubject<SpreeSubscription[]>([])
  public initialized$ = new BehaviorSubject<boolean>(false)
  public error$ = new BehaviorSubject<Error | null>(null)

  constructor(
    @Inject(APP_ENVIRONMENT) private environment: AppEnvironment,
    private ecommerce: EcommerceProvider,
    public spreeProvider: SpreeProvider,
    public storefrontUserService: StorefrontUserService
  ) {}

  public async init() {
    try {
      await this.storefrontUserService.init()

      if (!this.storefrontUserService.user) {
        return
      }

      this.storeUrl = this.storefrontUserService.storeUrl

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
      await this.loadSpreeStore()

      await this.getSubscriptions()

      this.initialized$.next(true)
    } catch (err) {
      this.error$.next(err)
    }
  }

  private async loadSpreeAccount() {
    try {
      await this.ecommerce.createExternalIdentifier({
        account: this.storefrontUserService.user.id
      })
      await this.refreshSpreeAccessToken()
    } catch (err) {
      if (err?.data?.code.includes('.conflict')) {
        await this.refreshSpreeAccessToken()
        return
      }
      throw new Error(err?.data?.message)
    }
  }

  private async refreshSpreeAccessToken() {
    const spreeAccessTokenResponse = await this.ecommerce.createToken({
      account: this.storefrontUserService.user.id,
      organization: this.environment.defaultOrgId
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
    taxonId?: string,
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

  private async loadSpreeStore() {
    const res = await this.spreeProvider.getCurrentStore()

    this.store$.next(res['data']['attributes'])
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

  public async applyCouponCode(code: string) {
    const res = await this.spree.cart.applyCouponCode(this.spreeToken, {
      coupon_code: code,
      include: cartIncludeFields
    })

    this.parseCartResult(res)
  }

  public async removeCouponCode(code: string) {
    const res = await this.spree.cart.removeCouponCode(this.spreeToken, code, {
      include: cartIncludeFields
    })

    this.parseCartResult(res)
  }

  public async advance() {
    const res = await this.spree.checkout.advance(this.spreeToken, {
      include: cartIncludeFields
    })

    if (res.isFail()) {
      throw new Error(res.fail().message)
    }

    this.parseCartResult(res)
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

    const shippingRates: ShippingRate[] = data.included
      .filter(
        (entry) =>
          entry.type === 'shipping_rate' && shippingRateIds.includes(entry.id)
      )
      .map((entry) => ({
        id: entry.id,
        name: `${entry.attributes.name} - ${entry.attributes.display_cost}`,
        shipping_method_id: entry.attributes.shipping_method_id,
        shipment: shipment.id,
        selected: entry.attributes.selected
      }))

    await this.loadSpreeCart()

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

  public async createStripeCheckoutSubscription(
    planId: string,
    returnUrl: string
  ): Promise<{ url: string }> {
    const res = await this.spreeProvider.createStripeCheckoutSubscription({
      plan: planId,
      return_url: returnUrl
    })
    return { url: res.url }
  }

  public async createStripeCustomerPortal(
    returnUrl: string
  ): Promise<{ url: string }> {
    const res = await this.spreeProvider.createStripeCustomerPortal({
      return_url: returnUrl
    })
    return { url: res.url }
  }

  private async getSubscriptions(): Promise<SpreeSubscription[]> {
    try {
      const res = await this.spreeProvider.getSubscriptions()
      this.subscriptions$.next(res)
      return res
    } catch (e) {
      console.error(e)
      throw new Error(e.message)
    }
  }

  private parseCartResult(res: IOrderResult, silentFail = false) {
    if (res.isFail()) {
      if (silentFail) {
        return
      }
      const error = res.fail() as SpreeError
      throw error
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

        const meals =
          product && product.attributes.public_metadata?.meals
            ? parseInt(product.attributes.public_metadata.meals)
            : 0

        const images = product
          ? this.getSpreeImages(product, entry.included)
          : []

        return {
          ...lineItem,
          meals: meals * lineItem.attributes.quantity,
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
    const promotion = entry.included.find((item) => item.type === 'promotion')
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
      shipment,
      shppingRateId: shipment?.relationships.selected_shipping_rate?.data?.id,
      isComplete: data.attributes.state === 'complete',
      promotion
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

      if (imageUrl?.startsWith('http')) {
        return [imageUrl]
      } else if (imageUrl) {
        return [this.storeUrl + imageUrl]
      }

      return []
    }

    return (entry.relationships.images?.data as RelationType[])
      .map((productImage) => {
        const imageUrl = included.find((item) => item.id === productImage.id)
          ?.attributes.original_url
        if (imageUrl?.startsWith('http')) {
          return imageUrl
        } else if (imageUrl) {
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
