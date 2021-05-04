import { Injectable } from '@angular/core'
import { CcrDatabase } from '@app/shared/model'
import {
  AccountProvider,
  GetLoginHistoryRequest,
  LoginHistoryItem,
  PagedResponse
} from '@coachcare/sdk'

@Injectable()
export class LoginHistoryDatabase extends CcrDatabase {
  constructor(private account: AccountProvider) {
    super()
  }

  fetch(
    criteria: GetLoginHistoryRequest
  ): Promise<PagedResponse<LoginHistoryItem>> {
    return this.account.getLoginHistory(criteria)
  }
}
