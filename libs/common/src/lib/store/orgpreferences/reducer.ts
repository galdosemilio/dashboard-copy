import { Palette } from '@coachcare/common/shared'
import { isEmpty, merge, pickBy } from 'lodash'
import { Actions, ActionTypes, UpdateAssets, UpdatePrefs } from './actions'
import { initialState, State } from './state'

export function orgPrefReducer(state = initialState, action: Actions): State {
  switch (action.type) {
    case ActionTypes.ASSETS: {
      const payload = (action as UpdateAssets).payload
      const prefs = merge({}, state, {
        assets: {
          logoUrl: payload.logoUrl,
          color: merge(
            {},
            Palette,
            pickBy(payload.color, (v) => !isEmpty(v))
          )
        }
      })
      return prefs
    }
    case ActionTypes.PREFS: {
      const payload = (action as UpdatePrefs).payload
      const prefs = merge({}, state, payload, {
        assets: {
          color: merge(
            {},
            Palette,
            payload.assets
              ? pickBy(payload.assets.color, (v) => !isEmpty(v))
              : {}
          )
        }
      })
      return prefs
    }

    default: {
      return state
    }
  }
}
