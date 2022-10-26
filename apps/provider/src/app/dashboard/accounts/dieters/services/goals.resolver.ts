import { Injectable } from '@angular/core'
import { ActivatedRouteSnapshot, Resolve } from '@angular/router'
import { GoalV2 } from '@coachcare/sdk'
import { FetchGoalResponse } from '@coachcare/sdk/dist/lib/providers/goal2/responses'

@Injectable()
export class GoalsResolver implements Resolve<FetchGoalResponse> {
  constructor(private goalV2: GoalV2) {}

  resolve(route: ActivatedRouteSnapshot): Promise<FetchGoalResponse> {
    return this.goalV2.fetch({ account: route.params['id'] })
  }
}
