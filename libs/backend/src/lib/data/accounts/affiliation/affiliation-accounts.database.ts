import { Injectable } from '@angular/core'
import { AppDatabase } from '@coachcare/backend/model'
import {
  AccountProvider,
  AccountSingle,
  CheckAccountRequest,
  CreateAccountRequest,
  GetAllAccountRequest,
  GetAllAccountResponse,
  GetListAccountRequest,
  GetListAccountResponse,
  UpdateAccountRequest
} from '@coachcare/sdk'
import { from, Observable } from 'rxjs'

@Injectable()
export class AffiliationAccountsDatabase extends AppDatabase {
  constructor(private account: AccountProvider) {
    super()
  }

  getAll(args: GetAllAccountRequest): Observable<GetAllAccountResponse> {
    return from(this.account.getAll(args))
  }

  getList(args: GetListAccountRequest): Observable<GetListAccountResponse> {
    return from(this.account.getList(args))
  }

  check(request: CheckAccountRequest): Promise<void> {
    return this.account.check(request)
  }

  getSingle(id: string): Promise<AccountSingle> {
    return this.account.getSingle(id)
  }

  create(request: CreateAccountRequest) {
    return this.account.create(request)
  }

  update(request: UpdateAccountRequest) {
    return this.account.update(request as any) // MERGETODO: CHECK THIS TYPE!!!
  }

  delete(id: string): Promise<void> {
    return this.account.setActive({ id, isActive: false })
  }
}
