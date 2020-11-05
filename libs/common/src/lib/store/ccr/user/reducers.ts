import { Actions, ActionTypes } from './actions';
import { initialState, State } from './state';

export function userReducer(state = initialState, action: Actions): State {
  switch (action.type) {
    case ActionTypes.LOAD:
    case ActionTypes.UPDATE: {
      return action.payload;
    }

    default: {
      return state;
    }
  }
}
