import { Injectable } from '@angular/core'
import { OrderEntry, SpreeProvider } from '@coachcare/sdk'

@Injectable()
export class StorefrontOrdersDatabase {
  constructor(private spree: SpreeProvider) {}

  public fetch(): Promise<{
    data: OrderEntry[]
  }> {
    return this.spree.getOrders({})
  }
}
