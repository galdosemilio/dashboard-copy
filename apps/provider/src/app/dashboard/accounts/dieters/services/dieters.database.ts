import { Injectable } from '@angular/core'
import { AccountProvider } from '@coachcare/sdk'

import { CcrDatabase } from '@app/shared/model'
import { AccListResponse } from '@coachcare/sdk'
import { DietersCriteria } from './dieters.criteria'

@Injectable()
export class DietersDatabase extends CcrDatabase {
  constructor(private account: AccountProvider) {
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
