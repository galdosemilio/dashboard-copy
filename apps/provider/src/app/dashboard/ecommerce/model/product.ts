import { Entity } from '@coachcare/sdk'
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
    this.imageUrl = this.resolveImageUrl(args, included ?? [])
  }

  private resolveImageUrl(
    args: ProductAttr,
    included?: JsonApiDocument[]
  ): string {
    const images = args.relationships.images?.data as Entity[]

    if (images.length === 0) {
      return ''
    }

    const imageId = images[0].id
    const imageEntry = included.find(
      (includedEntry) =>
        includedEntry.type === 'image' && includedEntry.id === imageId
    )

    return imageEntry?.attributes.original_url ?? ''
  }
}
