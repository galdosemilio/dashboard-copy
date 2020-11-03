import { callReducer } from '@app/layout/store/call/call.reducer';
import { ActionReducerMap } from '@ngrx/store';
import { layoutReducer } from './layout/layout.reducer';
import { responsiveReducer } from './responsive/responsive.reducer';
import { UIState } from './state';

export const reducers: ActionReducerMap<UIState> = {
  layout: layoutReducer,
  responsive: responsiveReducer,
  call: callReducer
};
