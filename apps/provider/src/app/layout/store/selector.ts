import { createFeatureSelector } from '@ngrx/store';
import { UIState } from './state';

export const name = 'ui';

export const uiSelector = createFeatureSelector<UIState>(name);
