import { ResponsiveState } from './responsive/index';
import { LayoutState } from './status/index';

export interface State {
  responsive: ResponsiveState.State;
  status: LayoutState.State;
}

export const initialState: State = {
  responsive: ResponsiveState.initialState,
  status: LayoutState.initialState
};
