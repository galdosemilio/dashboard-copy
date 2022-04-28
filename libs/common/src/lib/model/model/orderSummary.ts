import { AccountAddress, SpreeCreditCardEntry } from '@coachcare/sdk'
import { IOrder } from '@spree/storefront-api-v2-sdk/types/interfaces/Order'
import { EcommerceProduct } from './product'

export class OrderSummary {
  public billingAddress: AccountAddress
  public paymentMethod: Partial<SpreeCreditCardEntry>
  public products: EcommerceProduct[]
  public shippingAddress: AccountAddress
  public shippingCost: number
  public tax: number
  public total: number

  constructor(args: {
    order: IOrder
    shippingAddress: AccountAddress
    billingAddress: AccountAddress
    paymentMethod: Partial<SpreeCreditCardEntry>
    products: EcommerceProduct[]
  }) {
    this.billingAddress = args.billingAddress
    this.paymentMethod = args.paymentMethod
    this.products = args.products
    this.shippingAddress = args.shippingAddress
    this.shippingCost = Number(args.order.data.attributes.ship_total)
    this.tax = Number(args.order.data.attributes.tax_total)
    this.total = Number(args.order.data.attributes.total)
  }
}
