import { JsonApiDocument } from '@spree/storefront-api-v2-sdk/types/interfaces/JsonApi'
import { ProductAttr } from '@spree/storefront-api-v2-sdk/types/interfaces/Product'

export class EcommerceProduct {
  public id: string
  public imageUrl: string
  public name: string
  public description: string
  public price: number

  constructor(args: ProductAttr, included?: JsonApiDocument[]) {
    this.id = args.id
    this.name = args.attributes.name ?? ''
    this.description = args.attributes.description ?? ''
    this.price = Number(args.attributes.price) ?? 0
    this.imageUrl = included?.length ? included[0].attributes.original_url : ''
  }
}
