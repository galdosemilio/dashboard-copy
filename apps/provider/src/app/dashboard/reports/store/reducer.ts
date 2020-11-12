import { ActionReducerMap } from '@ngrx/store'
import { controlsReducer } from './controls/controls.reducer'
import { ReportsState } from './state'

export const reducers: ActionReducerMap<ReportsState> = {
  controls: controlsReducer
}
