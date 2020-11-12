import { OrgPrefState } from './orgpreferences/index'
import { RouterState } from './router/index'

export interface AppState {
  orgpref: OrgPrefState.State
  router: RouterState.State
}
