// tslint:disable-next-line:no-unused-variable
import { createFeatureSelector, MemoizedSelector } from '@ngrx/store';
import { State } from './state';

export const routerSelector = createFeatureSelector<State>('router');
