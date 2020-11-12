import { CCRConfig, Config, Palette } from '@app/config'
import { Action } from '@ngrx/store'
import { merge } from 'lodash'
import * as Actions from './config.action'

export function configReducer(state = Config, action: Action): CCRConfig {
  switch (action.type) {
    case Actions.INIT: {
      return (action as Actions.InitConfig).payload
    }

    case Actions.UPDATE: {
      return merge({}, state, (action as Actions.UpdateConfig).payload)
    }

    case Actions.PALETTE: {
      const palette = merge(
        {},
        Palette,
        (action as Actions.UpdatePalette).payload
      )
      state.colors.update(palette)
      return merge({}, state, { palette })
    }

    default: {
      return state
    }
  }
}
