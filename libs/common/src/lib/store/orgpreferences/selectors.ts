import { createFeatureSelector, createSelector, MemoizedSelector } from '@ngrx/store';
import { State } from './state';

export const NAME = 'orgpref';

// Main Selector
export const selectOrgPref = createFeatureSelector<State>(NAME);

// utility methods
export const getName = (state: State) => state.displayName;

export const getAssets = (state: State) => state.assets;

export const getColors = (state: State) => state.assets.color;

export const getFood = (state: State) => state.food;

// disabled for nobody if unconfigured
export const getScheduling = (state: State) =>
  state.scheduling ? state.scheduling.disabledFor : [];

// conferencing disabled if unconfigured
export const getConference = (state: State) => state.conference && state.conference.enabled || false;

/**
 * Inner Selectors
 */
export const selectAssets = createSelector(selectOrgPref, getAssets);

export const selectColors = createSelector(selectOrgPref, getColors);

export const selectFood = createSelector(selectOrgPref, getFood);

export const selectScheduling = createSelector(selectOrgPref, getScheduling);

export const selectConference: MemoizedSelector<object, boolean> = createSelector(
  selectOrgPref,
  getConference
);
