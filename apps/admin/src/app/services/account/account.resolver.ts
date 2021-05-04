import { Injectable } from '@angular/core'
import { ActivatedRouteSnapshot, Resolve, Router } from '@angular/router'

import { AccountProvider, AccountSingle } from '@coachcare/sdk'

@Injectable()
export class AccountResolver implements Resolve<AccountSingle | null> {
  constructor(private router: Router, private account: AccountProvider) {}

  resolve(route: ActivatedRouteSnapshot): Promise<AccountSingle | null> {
    const id = route.paramMap.get('id') as string

    return this.account
      .getSingle(id)
      .then((acc: AccountSingle) => {
        return acc
      })
      .catch(() => {
        // TODO notify error
        this.router.navigate(['../'])
        return null
      })
  }
}
