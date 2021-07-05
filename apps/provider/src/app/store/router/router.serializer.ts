import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router'
import { RouterStateSerializer } from '@ngrx/router-store'
import { RouterState } from './router.state'

export class AppRouterStateSerializer
  implements RouterStateSerializer<RouterState> {
  serialize(routerState: RouterStateSnapshot): RouterState {
    const { url } = routerState
    const { queryParams } = routerState.root

    let state: ActivatedRouteSnapshot = routerState.root
    while (state.firstChild) {
      state = state.firstChild
    }
    const { params } = state

    return { url, queryParams, params }
  }
}
