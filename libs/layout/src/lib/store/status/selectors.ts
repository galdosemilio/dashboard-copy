import { createSelector, MemoizedSelector } from '@ngrx/store'
import { selectLayout } from '../selectors'
import { State as ParentState } from '../state'
import { State } from './state'

export const NAME = 'status'

// Main Selector
export const selectStatus = createSelector(
  selectLayout,
  (state: ParentState) => state.status
)

// utility methods
export const getMenu = (state: State) => state.menu

export const getPanel = (state: State) => state.panel

export const getPanelComp = (state: State) => state.panel.component

/**
 * Inner Selectors
 */
export const selectMenu: MemoizedSelector<
  object,
  State['menu']
> = createSelector(selectStatus, getMenu)

export const selectPanel: MemoizedSelector<
  object,
  State['panel']
> = createSelector(selectStatus, getPanel)

export const selectPanelComp: MemoizedSelector<object, string> = createSelector(
  selectStatus,
  getPanelComp
)
