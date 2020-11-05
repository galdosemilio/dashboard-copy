import { Injectable } from '@angular/core'
import { ActivatedRouteSnapshot, Resolve, Router } from '@angular/router'
import { Account } from '@coachcare/npm-api'

import { ContextService, NotifierService } from '@app/service'
import { AccSingleResponse } from '@coachcare/npm-api'

@Injectable()
export class DieterResolver implements Resolve<AccSingleResponse> {
  constructor(
    private router: Router,
    private account: Account,
    private context: ContextService,
    private notifier: NotifierService
  ) {}

  async resolve(route: ActivatedRouteSnapshot): Promise<AccSingleResponse> {
    const id = route.params['id']
    try {
      if (!this.context.organization.permissions.allowClientPhi) {
        this.router.navigate(['/accounts/patients'])
      }

      const acc = await this.account.getSingle(id)

      if (this.context.accountId !== id) {
        try {
          const res = await this.account.getList({ query: acc.email })
          const coach = res.data.find((a) => a.email === acc.email)
          if (coach) {
            this.context.account = coach
            return acc
          } else {
            this.router.navigate(['/accounts/patients'])
          }
        } catch (e) {
          this.router.navigate(['/accounts/patients'])
        }
      } else {
        return acc
      }
    } catch (err) {
      this.notifier.error(err)
    }
  }
}
