import { ActionReducerMap, MetaReducer } from '@ngrx/store'
import { storeFreeze } from 'ngrx-store-freeze'
import { environment } from '../../environments/environment'
import { configReducer } from './config/index'
// import { logger } from './logger';
import { routerReducer } from './router/index'
import { AppState } from './state'

export const reducers: ActionReducerMap<AppState, any> = {
  config: configReducer,
  router: routerReducer
}

export const metaReducers: MetaReducer<AppState>[] = !environment.production
  ? [/*logger, */ storeFreeze]
  : []
