import { Injectable } from '@angular/core'
import { from, Observable, of } from 'rxjs'
import { Messaging } from '@coachcare/sdk'

import { CcrDatabase } from '@app/shared'
import { GetAllMessagingResponse } from '@coachcare/sdk'
import { ThreadsCriteria } from './threads.criteria'

@Injectable()
export class ThreadsDatabase extends CcrDatabase {
  constructor(private messaging: Messaging) {
    super()
  }

  fetchAll(args: ThreadsCriteria): Observable<GetAllMessagingResponse> {
    // validate accounts and return empty if not passed
    if (!args.accounts) {
      return of({} as GetAllMessagingResponse)
    }
    const accounts = args.accounts.sort((x, y) => Number(x) - Number(y))
    // observable of the API response
    return from(
      this.messaging.getAll({
        accounts: accounts,
        accountsExclusive: args.accountsExclusive ?? undefined,
        accountsInclusive: args.accountsInclusive ?? undefined,
        offset: args.offset ? args.offset : 0,
        limit: args.limit ? args.limit : undefined
      })
    )
  }
}
