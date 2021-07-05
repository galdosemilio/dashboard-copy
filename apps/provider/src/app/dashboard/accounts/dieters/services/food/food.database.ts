import { Injectable } from '@angular/core'
import { CcrDatabase } from '@app/shared'
import {
  FetchAllConsumedRequest,
  GetAllFoodConsumedResponse
} from '@coachcare/sdk'
import { from, Observable } from 'rxjs'
import { FoodConsumed } from '@coachcare/sdk'

@Injectable()
export class FoodDatabase extends CcrDatabase {
  constructor(private foodConsumed: FoodConsumed) {
    super()
  }

  fetchAll(
    args: FetchAllConsumedRequest
  ): Observable<GetAllFoodConsumedResponse> {
    return from(
      this.foodConsumed.getAll({
        account: args.account.toString(),
        limit: 'all',
        start: args.startDate,
        end: args.endDate
      })
    )
  }
}
