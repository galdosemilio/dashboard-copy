import { EcommerceProduct } from '@coachcare/common/model'
import {
  AccountAddress,
  Entity,
  OrderEntry,
  SpreeCreditCardEntry
} from '@coachcare/sdk'
import { AccountAddressAttr } from '@spree/storefront-api-v2-sdk/types/interfaces/Account'
import { JsonApiDocument } from '@spree/storefront-api-v2-sdk/types/interfaces/JsonApi'
import { OrderAttr } from '@spree/storefront-api-v2-sdk/types/interfaces/Order'
import { ProductAttr } from '@spree/storefront-api-v2-sdk/types/interfaces/Product'

export class StorefrontOrdersResponse {
  data: OrderEntry[]
  meta?: {
    count: number
    total_count: number
    total_pages: number
  }
}

export class StorefrontOrderEntry {
  public completedAt: string
  public billingAddress?: AccountAddress
  public id: string
  public paymentMethod: Partial<SpreeCreditCardEntry>
  public products: EcommerceProduct[]
  public shippingAddress?: AccountAddress
  public shippingCost: number
  public tax: number
  public total: number

  constructor(
    args: OrderAttr,
    included?: JsonApiDocument[],
    storeUrl?: string
  ) {
    this.products = this.getLineProductsAndVariants(args, included).map(
      ({ lineItem, variant }) =>
        new EcommerceProduct(
          {
            ...variant,
            attributes: {
              ...variant.attributes,
              name: lineItem.attributes.name,
              price: lineItem.attributes.price
            }
          },
          included,
          storeUrl
        )
    )
    this.id = args.attributes.number
    this.tax = +args.attributes.tax_total
    this.total = +args.attributes.total
    this.completedAt = args.attributes.completed_at?.toString()
    this.billingAddress = this.getAddressFromIncluded(
      (args.relationships.billing_address.data as Entity).id,
      included
    )
    this.shippingAddress = this.getAddressFromIncluded(
      (args.relationships.shipping_address.data as Entity).id,
      included
    )
    this.paymentMethod = this.getPaymentMethod(included)
    this.shippingCost = +args.attributes.ship_total
  }

  private getAddressFromIncluded(
    id: string,
    included?: JsonApiDocument[]
  ): AccountAddress {
    if (!included?.length) {
      return null
    }

    const rawAddress: AccountAddressAttr = included.find(
      (item) => item.type === 'address' && item.id === id
    )

    if (!rawAddress) {
      return null
    }

    return {
      id: rawAddress.id,
      name: `${rawAddress.attributes.firstname} ${rawAddress.attributes.lastname}`,
      address1: rawAddress.attributes.address1,
      address2: rawAddress.attributes.address2,
      city: rawAddress.attributes.city,
      country: {
        id: rawAddress.attributes.country_iso,
        name: rawAddress.attributes.country_iso
      },
      stateProvince: rawAddress.attributes.state_name,
      postalCode: rawAddress.attributes.zipcode,
      labels: [] // we don't care for labels here
    }
  }

  private getLineProductsAndVariants(
    args: OrderAttr,
    included?: JsonApiDocument[]
  ): { lineItem: ProductAttr; variant: ProductAttr }[] {
    if (!included?.length) {
      return []
    }

    const rawVariants = included.filter((item) => item.type === 'variant')

    return (args.relationships.line_items.data as ProductAttr[])
      .map((lineItem) =>
        included.find(
          (item) => item.type === 'line_item' && item.id === lineItem.id
        )
      ) // found detailed line items
      .filter((lineItem) => lineItem)
      .map((lineItem) => ({
        lineItem,
        variant: rawVariants.find(
          (variant) => variant.id === lineItem.relationships.variant.data.id
        ) ?? { attributes: {}, type: '', id: '', relationships: {} } // in case the variant entry is removed
      })) // map into return value
  }

  private getPaymentMethod(
    included?: JsonApiDocument[]
  ): Partial<SpreeCreditCardEntry> | null {
    if (!included?.length) {
      return null
    }

    return included.find((item) => item.type === 'credit_card') ?? null
  }
}
