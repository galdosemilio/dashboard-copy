import { Injectable } from '@angular/core'
import { ActivatedRouteSnapshot, Resolve, Router } from '@angular/router'
import { AccountProvider, AccSingleResponse } from '@coachcare/sdk'

import { ContextService, NotifierService } from '@app/service'

@Injectable()
export class CoachResolver implements Resolve<AccSingleResponse> {
  constructor(
    private router: Router,
    private account: AccountProvider,
    private context: ContextService,
    private notifier: NotifierService
  ) {}

  async resolve(route: ActivatedRouteSnapshot): Promise<AccSingleResponse> {
    const id = route.params['id']
    try {
      if (!this.context.organization.permissions.admin) {
        this.router.navigate(['/accounts/coaches'])
      }

      if (this.context.user.id === id) {
        this.router.navigate(['/profile'])
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
            this.router.navigate(['/accounts/coaches'])
          }
        } catch (e) {
          this.router.navigate(['/accounts/coaches'])
        }
      } else {
        return acc
      }
    } catch (err) {
      this.notifier.error(err)
    }
  }
}
