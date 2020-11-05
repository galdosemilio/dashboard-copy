import { Injectable } from '@angular/core'
import { CcrDatabase } from '@app/shared/model'
import {
  GetLoginHistoryRequest,
  LoginHistoryItem,
  PagedResponse
} from '@coachcare/npm-api'
import { Account } from '@coachcare/npm-api/selvera-api/providers/account'

@Injectable()
export class LoginHistoryDatabase extends CcrDatabase {
  constructor(private account: Account) {
    super()
  }

  fetch(
    criteria: GetLoginHistoryRequest
  ): Promise<PagedResponse<LoginHistoryItem>> {
    return this.account.getLoginHistory(criteria)
  }
}
