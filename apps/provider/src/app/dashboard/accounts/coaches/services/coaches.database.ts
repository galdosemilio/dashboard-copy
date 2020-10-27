import { Injectable } from '@angular/core';
import { from, Observable } from 'rxjs';
import { Account } from 'selvera-api';

import { CcrDatabase } from '@app/shared';
import { AccListResponse } from '@app/shared/selvera-api';
import { CoachesCriteria } from './coaches.criteria';

@Injectable()
export class CoachesDatabase extends CcrDatabase {
  constructor(private account: Account) {
    super();
  }

  fetchAll(args: CoachesCriteria): Observable<AccListResponse> {
    // observable of the API response
    return from(
      this.account.getList({
        accountType: '2',
        organization: args.organization,
        query: args.query,
        offset: args.offset,
        limit: args.limit,
        sort: args.sort
      })
    );
  }
}
