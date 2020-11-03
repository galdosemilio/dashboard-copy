import { createSelector, MemoizedSelector } from '@ngrx/store';
import { selectLayout } from '../selectors';
import { State as ParentState } from '../state';
import { State } from './state';

export const NAME = 'responsive';

// Main Selector
export const selectResponsive = createSelector(
  selectLayout,
  (state: ParentState) => state.responsive
);

// utility methods
export const getScreen = (state: State): string => state.screen;

/**
 * Inner Selectors
 */
export const selectScreen: MemoizedSelector<object, string> = createSelector(
  selectResponsive,
  getScreen
);
