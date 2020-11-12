import { createFeatureSelector, MemoizedSelector } from '@ngrx/store'
import { State } from './state'

export const NAME = 'ccr'

export const selectData: MemoizedSelector<
  object,
  State
> = createFeatureSelector<State>(NAME)
