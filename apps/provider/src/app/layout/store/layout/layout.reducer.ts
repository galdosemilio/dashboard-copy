import { Action } from '@ngrx/store'
import { merge } from 'lodash'
import * as Actions from './layout.action'
import { initialLayoutState, UILayoutState } from './layout.state'

export function layoutReducer(
  state = initialLayoutState,
  action: Action
): UILayoutState {
  switch (action.type) {
    // layout
    case Actions.LAYOUT_UPDATE: {
      const newState = (action as Actions.UpdateLayout).payload
      return merge({}, state, newState)
    }

    // menu
    case Actions.MENU_STATE: {
      const opened = (action as any).payload.opened
      return merge({}, state, { menu: { opened } })
    }

    case Actions.MENU_TOGGLE: {
      const current = state.menu.opened
      return merge({}, state, { menu: { opened: !current } })
    }

    // panel
    case Actions.PANEL_STATE: {
      const opened = (action as any).payload.opened
      return merge({}, state, { panel: { opened } })
    }

    case Actions.PANEL_TOGGLE: {
      const current = state.panel.opened
      return merge({}, state, { panel: { opened: !current } })
    }

    case Actions.PANEL_ACTIVATION: {
      const enabled = (action as any).payload.enabled
      return merge({}, state, { panel: { enabled } })
    }

    case Actions.PANEL_COMPONENT: {
      const component = (action as Actions.SetPanelComponent).payload.component
      return merge({}, state, { panel: { enabled: true, component } })
    }

    default: {
      return state
    }
  }
}
