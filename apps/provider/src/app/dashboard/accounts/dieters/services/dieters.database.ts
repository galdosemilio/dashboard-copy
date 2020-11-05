import { Injectable } from '@angular/core'
import { Account } from 'selvera-api'

import { CcrDatabase } from '@app/shared'
import { AccListResponse } from '@coachcare/npm-api'
import { DietersCriteria } from './dieters.criteria'

@Injectable()
export class DietersDatabase extends CcrDatabase {
  constructor(private account: Account) {
    super()
  }

  fetchAll(args: DietersCriteria): Promise<AccListResponse> {
    return this.account.getList({
      accountType: '3',
      organization: args.organization,
      query: args.query,
      offset: args.offset,
      limit: args.pageSize,
      sort: args.sort
    })
  }
}
