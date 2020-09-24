import { Injectable } from '@angular/core';
import { TableDataSource } from '@coachcare/backend/model';
import {
  AccountAccessData,
  GetListAccountRequest,
  GetListAccountResponse
} from '@coachcare/backend/services';
import { from, Observable } from 'rxjs';
import { AffiliationAccountsDatabase } from './affiliation-accounts.database';

@Injectable()
export class AffiliationAccountsDataSource extends TableDataSource<
  AccountAccessData,
  GetListAccountResponse,
  GetListAccountRequest
> {
  constructor(protected database: AffiliationAccountsDatabase) {
    super();
  }

  defaultFetch(): GetListAccountResponse {
    return {
      data: [],
      pagination: {}
    };
  }

  fetch(criteria: GetListAccountRequest): Observable<GetListAccountResponse> {
    return from(this.database.getList(criteria));
  }

  mapResult(result: GetListAccountResponse): any {
    // pagination handling
    this.total = result.pagination.next
      ? result.pagination.next + 1
      : (this.criteria.offset || 0) + result.data.length;

    return result.data;
  }
}
