import { Injectable } from '@angular/core'
import { ActivatedRouteSnapshot, Resolve } from '@angular/router'
import { Goal } from '@coachcare/sdk'

import { FetchGoalResponse } from '@coachcare/sdk'

@Injectable()
export class GoalsResolver implements Resolve<FetchGoalResponse> {
  constructor(private goal: Goal) {}

  resolve(route: ActivatedRouteSnapshot): Promise<FetchGoalResponse> {
    return this.goal.fetch({ account: route.params['id'] })
  }
}
