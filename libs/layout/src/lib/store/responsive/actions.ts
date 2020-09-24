import { Action } from '@ngrx/store';
import { State } from './state';

/**
 * Action Types
 */
export enum ActionTypes {
  RES_UPDATE = '@layout/responsive/update'
}

/**
 * Actions
 */
export class UpdateResponsive implements Action {
  readonly type = ActionTypes.RES_UPDATE;

  constructor(public payload: Partial<State>) {}
}

// Actions data type
export type Actions = UpdateResponsive;
