import { createSelector } from '@ngrx/store';
import { uiSelector } from '../selector';
import { UIState } from '../state';

// TODO review if we can use `name`.controls.criteria
export const responsiveSelector = createSelector(
  uiSelector,
  (state: UIState) => state.responsive
);
