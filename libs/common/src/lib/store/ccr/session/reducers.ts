import { CcrRolesMap } from '@coachcare/common/shared'
import { Actions, ActionTypes } from './actions'
import { initialState, State } from './state'

export function sessionReducer(state = initialState, action: Actions): State {
  switch (action.type) {
    case ActionTypes.INIT:
    case ActionTypes.UPDATE:
      return {
        ...state,
        ...action.payload
      }

    case ActionTypes.LANG: {
      return {
        ...state,
        language: action.payload
      }
    }

    case ActionTypes.LOGIN: {
      return {
        ...state,
        loggedIn: true,
        account: CcrRolesMap(action.payload.accountType.id)
      }
    }

    case ActionTypes.LOGOUT: {
      return {
        ...state,
        loggedIn: false,
        account: ''
      }
    }

    default: {
      return state
    }
  }
}
