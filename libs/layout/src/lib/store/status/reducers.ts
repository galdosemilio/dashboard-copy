import { merge } from 'lodash'
import {
  Actions,
  ActionTypes,
  SetPanelComponent,
  UpdateLayout
} from './actions'
import { initialState, State } from './state'

export function layoutReducer(state = initialState, action: Actions): State {
  switch (action.type) {
    // layout
    case ActionTypes.LAYOUT_UPDATE: {
      const newState = (action as UpdateLayout).payload
      return merge({}, state, newState)
    }

    // menu
    case ActionTypes.MENU_STATE: {
      const opened = (action as any).payload.opened
      return merge({}, state, { menu: { opened } })
    }

    case ActionTypes.MENU_TOGGLE: {
      const current = state.menu.opened
      return merge({}, state, { menu: { opened: !current } })
    }

    // panel
    case ActionTypes.PANEL_STATE: {
      const opened = (action as any).payload.opened
      return merge({}, state, { panel: { opened } })
    }

    case ActionTypes.PANEL_TOGGLE: {
      const current = state.panel.opened
      return merge({}, state, { panel: { opened: !current } })
    }

    case ActionTypes.PANEL_ACTIVATION: {
      const enabled = (action as any).payload.enabled
      return merge({}, state, { panel: { enabled } })
    }

    case ActionTypes.PANEL_COMPONENT: {
      const component = (action as SetPanelComponent).payload.component
      return merge({}, state, { panel: { enabled: true, component } })
    }

    default: {
      return state
    }
  }
}
