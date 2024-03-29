import { Injectable } from '@angular/core'
import { ActivatedRouteSnapshot, Resolve, Router } from '@angular/router'
import { AccountProvider } from '@coachcare/sdk'

import { ContextService, NotifierService } from '@app/service'
import { AccSingleResponse } from '@coachcare/sdk'

@Injectable()
export class DieterResolver implements Resolve<AccSingleResponse> {
  constructor(
    private router: Router,
    private account: AccountProvider,
    private context: ContextService,
    private notifier: NotifierService
  ) {}

  async resolve(route: ActivatedRouteSnapshot): Promise<AccSingleResponse> {
    const id = route.params['id']
    try {
      if (!this.context.organization.permissions.allowClientPhi) {
        void this.router.navigate(['/accounts/patients'])
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
            void this.router.navigate(['/accounts/patients'])
          }
        } catch (e) {
          void this.router.navigate(['/accounts/patients'])
        }
      } else {
        return acc
      }
    } catch (err) {
      this.notifier.error(err)
    }
  }
}
