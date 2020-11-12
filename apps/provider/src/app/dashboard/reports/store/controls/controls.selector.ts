import { createSelector } from '@ngrx/store'
import { reportsSelector } from '../selector'
import { ReportsState } from '../state'
import { ReportsControlsState } from './controls.state'

// TODO review if we can use `name`.controls.criteria
export const controlsSelector = createSelector(
  reportsSelector,
  (state: ReportsState) => state.controls
)

export const criteriaSelector = createSelector(
  controlsSelector,
  (state: ReportsControlsState) => state.criteria
)
