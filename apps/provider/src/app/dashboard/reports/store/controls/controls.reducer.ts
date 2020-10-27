import { Action } from '@ngrx/store';
import { isEqual } from 'lodash';
import * as Actions from './controls.action';
import { initialState, ReportsControlsState } from './controls.state';

export function controlsReducer(
  state = initialState,
  action: Action
): ReportsControlsState {
  switch (action.type) {
    // controls updated
    case Actions.UPDATE: {
      const criteria = (action as Actions.UpdateControls).payload.criteria;
      return isEqual(state.criteria, criteria)
        ? state
        : {
            ...state,
            criteria
          };
    }

    default: {
      return state;
    }
  }
}
