import { Injectable } from '@angular/core'
import { FoodKey } from 'selvera-api'

import { CcrDatabase } from '@app/shared'
import {
  FetchAllConsumedKeyRequest,
  FetchAllConsumedKeyResponse,
  FetchAllOrganizationKeyRequest,
  FetchAllOrganizationKeyResponse
} from '@coachcare/npm-api'

@Injectable()
export class FoodKeyDatabase extends CcrDatabase {
  constructor(private foodKey: FoodKey) {
    super()
  }

  fetchAll(
    args: FetchAllConsumedKeyRequest
  ): Promise<FetchAllConsumedKeyResponse> {
    return this.foodKey.fetchAllConsumed({
      organization: args.organization,
      account: args.account,
      limit: args.limit,
      startDate: args.startDate,
      endDate: args.endDate,
      key: args.key
    })
  }

  orgKeys(
    args: FetchAllOrganizationKeyRequest
  ): Promise<FetchAllOrganizationKeyResponse[]> {
    return this.foodKey.fetchAllOrganizationKeys(args)
  }
}
