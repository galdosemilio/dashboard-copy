import { Injectable } from '@angular/core'
import { TableDataSource } from '@coachcare/backend/model'
import { from, Observable } from 'rxjs'
import { StorefrontOrdersDatabase } from './account-orders.database'
import {
  StorefrontOrderEntry,
  StorefrontOrdersResponse
} from '@coachcare/storefront/model'
import { OrderAttr } from '@spree/storefront-api-v2-sdk/types/interfaces/Order'

@Injectable()
export class StorefrontOrdersDataSource extends TableDataSource<
  StorefrontOrderEntry,
  StorefrontOrdersResponse,
  void
> {
  constructor(protected database: StorefrontOrdersDatabase) {
    super()
  }

  defaultFetch(): StorefrontOrdersResponse {
    return {
      data: []
    }
  }

  fetch(): Observable<StorefrontOrdersResponse> {
    return from(this.database.fetch())
  }

  mapResult(result: StorefrontOrdersResponse): Array<StorefrontOrderEntry> {
    return result.data.map(
      (entry) => new StorefrontOrderEntry(entry as OrderAttr)
    )
  }
}
