import { SessionState } from './session/index';
import { UserState } from './user/index';

export interface State {
  session: SessionState.State;
  user: UserState.State;
}

export const initialState = {
  session: SessionState.initialState,
  user: UserState.initialState
};
