import { ActionReducerMap, MetaReducer } from '@ngrx/store'
import { storeFreeze } from 'ngrx-store-freeze'
import { environment } from '../../environments/environment'
import { configReducer } from './config/index'
import { measurementLabelReducer } from './measurement-label'
// import { logger } from './logger';
import { routerReducer } from './router/index'
import { AppState } from './state'

export const reducers: ActionReducerMap<AppState, any> = {
  config: configReducer,
  router: routerReducer,
  measurementLabels: measurementLabelReducer
}

export const metaReducers: MetaReducer<AppState>[] = !environment.production
  ? [/*logger, */ storeFreeze]
  : []
