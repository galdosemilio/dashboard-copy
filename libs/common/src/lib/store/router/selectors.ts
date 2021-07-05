// eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
import { createFeatureSelector, MemoizedSelector } from '@ngrx/store'
import { State } from './state'

export const routerSelector = createFeatureSelector<State>('router')
