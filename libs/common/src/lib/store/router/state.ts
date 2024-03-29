import { Params } from '@angular/router'
import { RouterReducerState } from '@ngrx/router-store'

export interface RouteState {
  url: string
  queryParams: Params
  params: Params
}

export type State = RouterReducerState<RouteState>
