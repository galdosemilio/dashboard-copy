import { Injectable } from '@angular/core'
import { SearchDataSource } from '@coachcare/backend/model'
import {
  AccountFullData,
  AccountSingle,
  GetAllAccountRequest,
  GetAllAccountResponse
} from '@coachcare/sdk'
import { _, AutocompleterOption } from '@coachcare/backend/shared'
import { get } from 'lodash'
import { Observable } from 'rxjs'
import { AccountsDatabase } from './accounts.database'

@Injectable()
export class AccountsDataSource extends SearchDataSource<
  AccountFullData,
  GetAllAccountResponse,
  GetAllAccountRequest
> {
  constructor(protected database: AccountsDatabase) {
    super()
  }

  defaultFetch(): GetAllAccountResponse {
    return {
      data: [],
      pagination: {}
    }
  }

  fetch(criteria: GetAllAccountRequest): Observable<GetAllAccountResponse> {
    criteria.query = criteria.query ? criteria.query : undefined
    criteria.organization = criteria.organization
      ? criteria.organization
      : undefined

    return this.database.getAll(criteria)
  }

  search(query: string, limit: number) {
    // custom search parameters
    this.refresh({ query, limit })
  }

  getSingle(id: string): Promise<AccountSingle> {
    return this.database.getSingle(id)
  }

  mapResult(result: GetAllAccountResponse): Array<AccountFullData> {
    // pagination handling
    this.getTotal(result)

    return result.data
  }

  mapSearch(result: Array<AccountFullData>): Array<AutocompleterOption> {
    // search handling
    return result.map((acc: AccountFullData) => this.mapSingle(acc))
  }

  mapSingle(acc: AccountFullData): AutocompleterOption {
    return {
      id: acc.id,
      value: this.getRoute(acc),
      viewValue: `${acc.firstName} ${acc.lastName}`,
      viewSubvalue: this.getType(acc),
      viewNote: acc.email
    }
  }

  private getRoute(account: AccountFullData) {
    const types = {
      1: 'admins',
      2: 'coaches',
      3: 'patients'
    }
    const type = get(types, account.accountType.id, '')
    // FIXME route according to the current site
    return `/admin/accounts/${type}/${account.id}`
  }

  private getType(account: AccountFullData) {
    const types = {
      1: _('ROLE.ADMIN'),
      2: _('ROLE.COACH'),
      3: _('ROLE.PATIENT'),
      4: _('ROLE.MANAGER')
    }
    const type = get(types, account.accountType.id, '')
    return type
  }
}
