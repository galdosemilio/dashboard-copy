import { createSelector } from '@ngrx/store'
import { uiSelector } from '../selector'
import { UIState } from '../state'
import { UILayoutState } from './layout.state'

// TODO review if we can use `name`.controls.criteria
export const layoutSelector = createSelector(
  uiSelector,
  (state: UIState) => state.layout
)

export const menuSelector = createSelector(
  layoutSelector,
  (state: UILayoutState) => state.menu
)

export const panelSelector = createSelector(
  layoutSelector,
  (state: UILayoutState) => state.panel
)

export const panelCompSelector = createSelector(
  layoutSelector,
  (state: UILayoutState) => state.panel.component
)
