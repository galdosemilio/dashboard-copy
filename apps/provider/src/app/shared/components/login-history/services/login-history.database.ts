import { Injectable } from '@angular/core';
import { CcrDatabase } from '@app/shared/model';
import {
  GetLoginHistoryRequest,
  LoginHistoryItem,
  PagedResponse
} from '@app/shared/selvera-api';
import { Account } from 'selvera-api';

@Injectable()
export class LoginHistoryDatabase extends CcrDatabase {
  constructor(private account: Account) {
    super();
  }

  fetch(criteria: GetLoginHistoryRequest): Promise<PagedResponse<LoginHistoryItem>> {
    return this.account.getLoginHistory(criteria);
  }
}
