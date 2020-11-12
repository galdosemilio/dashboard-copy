import { ActionReducerMap, MetaReducer } from '@ngrx/store'
import { storeFreeze } from 'ngrx-store-freeze'
// import { logger } from './logger';
import { orgPrefReducer } from './orgpreferences/reducer'
import { routerReducer } from './router/reducer'
import { AppState } from './state'

export const reducers: ActionReducerMap<AppState> = {
  orgpref: orgPrefReducer,
  router: routerReducer
}

export const devMetaReducers: MetaReducer<AppState>[] = [
  /*logger,*/ storeFreeze
]
