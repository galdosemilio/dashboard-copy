import { ActionReducer } from '@ngrx/store';
import { AppState } from './state';

export function logger(reducer: ActionReducer<AppState>): ActionReducer<AppState> {
  return function (state: AppState, action: any): AppState {
    console.log(`${action.type}: `);

    if (action.payload) {
      console.log('  Payload: ', action.payload);
    }
    console.log('  State:   ', state);

    return reducer(state, action);
  };
}
