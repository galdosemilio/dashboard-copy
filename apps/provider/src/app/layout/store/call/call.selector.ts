import { createSelector } from '@ngrx/store'
import { uiSelector } from '../selector'
import { UIState } from '../state'

export const callSelector = createSelector(
  uiSelector,
  (state: UIState) => state.call
)
