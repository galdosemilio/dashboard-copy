import { RouterReducerState } from '@ngrx/router-store'
import { createFeatureSelector as create } from '@ngrx/store'
import { RouterState } from './router.state'

export const routerSelector = create<RouterReducerState<RouterState>>('router')
