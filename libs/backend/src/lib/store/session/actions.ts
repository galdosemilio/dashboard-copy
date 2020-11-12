import { Action } from '@ngrx/store'
import { State } from './state'

/**
 * Action Types
 */
export enum ActionTypes {
  INIT = '@ccr/session/init',
  UPDATE = '@ccr/session/update',
  LANG = '@ccr/session/lang',
  LOGIN = '@ccr/user/login',
  LOGOUT = '@ccr/user/logout'
}

/**
 * Actions
 */
export class SessionLoaded implements Action {
  readonly type = ActionTypes.INIT

  constructor(public payload: Partial<State>) {}
}

export class SessionUpdated implements Action {
  readonly type = ActionTypes.UPDATE

  constructor(public payload: Partial<State>) {}
}

export class ChangeLang implements Action {
  readonly type = ActionTypes.LANG

  constructor(public payload: string) {}
}

export class Login implements Action {
  readonly type = ActionTypes.LOGIN

  constructor(public payload: any) {
    // this receives an AccountSingle response
  }
}

export class Logout implements Action {
  readonly type = ActionTypes.LOGOUT
}

// Actions data type
export type Actions =
  | SessionLoaded
  | SessionUpdated
  | ChangeLang
  | Login
  | Logout
