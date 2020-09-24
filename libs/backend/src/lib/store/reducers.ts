import { ActionReducerMap } from '@ngrx/store';
import { sessionReducer } from './session/reducers';
import { userReducer } from './user/reducers';

import { State } from './state';

export const reducers: ActionReducerMap<State> = {
  session: sessionReducer,
  user: userReducer
};
