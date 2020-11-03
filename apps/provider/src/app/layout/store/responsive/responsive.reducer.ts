import { Action } from '@ngrx/store';
import { merge } from 'lodash';

import * as Actions from './responsive.action';
import { initialResponsiveState, UIResponsiveState } from './responsive.state';

export function responsiveReducer(
  state = initialResponsiveState,
  action: Action
): UIResponsiveState {
  switch (action.type) {
    // responsive values update
    case Actions.RES_UPDATE: {
      const responsive = (action as Actions.UpdateResponsive).payload;
      return merge({}, state, responsive);
    }

    default: {
      return state;
    }
  }
}
