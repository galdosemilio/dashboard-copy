import { TableDataSource } from '@coachcare/backend/model'
import { from, Observable } from 'rxjs'
import { StorefrontPaymentMethod } from '../../model'
import {
  StorefrontFetchPaymentMethodResponse,
  StorefrontPaymentMethodsDatabase
} from './payment-methods.database'

export class StorefrontPaymentMethodsDataSource extends TableDataSource<
  StorefrontPaymentMethod,
  StorefrontFetchPaymentMethodResponse,
  void
> {
  constructor(protected database: StorefrontPaymentMethodsDatabase) {
    super()
  }

  public defaultFetch(): StorefrontFetchPaymentMethodResponse {
    return { data: [] }
  }

  public fetch(): Observable<StorefrontFetchPaymentMethodResponse> {
    return from(this.database.fetch())
  }

  public mapResult(
    result: StorefrontFetchPaymentMethodResponse
  ): StorefrontPaymentMethod[] {
    return result.data
  }
}
