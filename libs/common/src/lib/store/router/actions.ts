import { NavigationExtras } from '@angular/router'
import { Action } from '@ngrx/store'

/**
 * Action Types
 */
export enum ActionTypes {
  GO = '@angular/router/go',
  BACK = '@angular/router/back',
  FORWARD = '@angular/router/forward'
}

/**
 * Actions
 */
export class Go implements Action {
  readonly type = ActionTypes.GO

  constructor(
    public payload: {
      path: any[]
      query?: object
      extras?: NavigationExtras
    }
  ) {}
}

export class Back implements Action {
  readonly type = ActionTypes.BACK
}

export class Forward implements Action {
  readonly type = ActionTypes.FORWARD
}

// Actions data type
export type Actions = Go | Back | Forward
