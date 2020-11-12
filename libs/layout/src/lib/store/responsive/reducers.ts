import { merge } from 'lodash'
import { Actions, ActionTypes, UpdateResponsive } from './actions'
import { initialState, State } from './state'

export function responsiveReducer(
  state = initialState,
  action: Actions
): State {
  switch (action.type) {
    case ActionTypes.RES_UPDATE: {
      const responsive = (action as UpdateResponsive).payload
      return merge({}, state, responsive)
    }

    default: {
      return state
    }
  }
}
