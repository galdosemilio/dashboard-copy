import { ActionReducerMap } from '@ngrx/store'
import { responsiveReducer } from './responsive/reducers'
import { layoutReducer } from './status/reducers'

import { State } from './state'

export const reducers: ActionReducerMap<State> = {
  responsive: responsiveReducer,
  status: layoutReducer
}
