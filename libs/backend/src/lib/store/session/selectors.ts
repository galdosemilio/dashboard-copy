import { createSelector, MemoizedSelector } from '@ngrx/store';
import { selectData } from '../selectors';
import { State as ParentState } from '../state';
import { State } from './state';

export const NAME = 'session';

// Main Selector
export const selectSession = createSelector(selectData, (state: ParentState) => state.session);

// utility methods
export const getLanguage = (state: State): string => state.language;

export const getLoaded = (state: State): boolean => state.loaded;

export const getLoggedIn = (state: State): boolean => state.loggedIn;

export const getAccount = (state: State): string => state.account;

/**
 * Inner Selectors
 */
export const selectLanguage: MemoizedSelector<object, string> = createSelector(
  selectSession,
  getLanguage
);

export const selectLoaded: MemoizedSelector<object, boolean> = createSelector(
  selectSession,
  getLoaded
);

export const selectLoggedIn: MemoizedSelector<object, boolean> = createSelector(
  selectSession,
  getLoggedIn
);

export const selectAccount: MemoizedSelector<object, string> = createSelector(
  selectSession,
  getAccount
);
