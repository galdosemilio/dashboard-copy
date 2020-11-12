import { createFeatureSelector, MemoizedSelector } from '@ngrx/store'
import { State } from './state'

export const NAME = 'layout'

export const selectLayout: MemoizedSelector<
  object,
  State
> = createFeatureSelector<State>(NAME)
