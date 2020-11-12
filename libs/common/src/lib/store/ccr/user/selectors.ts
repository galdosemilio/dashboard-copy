import { createSelector, MemoizedSelector } from '@ngrx/store'
import { selectData } from '../selectors'
import { State as ParentState } from '../state'
import { State } from './state'

export const NAME = 'user'

// Main Selector
export const selectUser = createSelector(
  selectData,
  (state: ParentState) => state.user
)

// utility methods
export const getId = (state: State): string => state.id

export const getMeasurementPref = (state: State): string =>
  state.measurementPreference

export const getTimezone = (state: State): string => state.timezone

/**
 * Inner Selectors
 */
export const selectId: MemoizedSelector<object, string> = createSelector(
  selectUser,
  getId
)

export const selectUnit: MemoizedSelector<object, string> = createSelector(
  selectUser,
  getMeasurementPref
)

export const selectTimezone: MemoizedSelector<object, string> = createSelector(
  selectUser,
  getTimezone
)
