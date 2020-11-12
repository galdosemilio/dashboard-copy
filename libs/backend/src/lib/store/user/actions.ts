import { Action } from '@ngrx/store'
import { State } from './state'

/**
 * Action Types
 */
export enum ActionTypes {
  LOAD = '@ccr/user/load',
  UPDATE = '@ccr/user/update'
}

/**
 * Actions
 */
export class LoadUser implements Action {
  readonly type = ActionTypes.LOAD

  constructor(public payload: State) {}
}

export class UpdateUser implements Action {
  readonly type = ActionTypes.UPDATE

  constructor(public payload: State) {}
}

// Actions data type
export type Actions = LoadUser | UpdateUser
