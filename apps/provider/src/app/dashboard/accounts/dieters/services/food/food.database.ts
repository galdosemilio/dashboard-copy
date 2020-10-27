import { Injectable } from '@angular/core';
import { _, CcrDatabase } from '@app/shared';
import {
  FetchAllConsumedRequest,
  GetAllFoodConsumedResponse
} from '@app/shared/selvera-api';
import { from, Observable } from 'rxjs';
import { FoodConsumed } from 'selvera-api';

@Injectable()
export class FoodDatabase extends CcrDatabase {
  constructor(private foodConsumed: FoodConsumed) {
    super();
  }

  fetchAll(args: FetchAllConsumedRequest): Observable<GetAllFoodConsumedResponse> {
    return from(
      this.foodConsumed.getAll({
        account: args.account.toString(),
        limit: 'all',
        start: args.startDate,
        end: args.endDate
      })
    );
  }
}
