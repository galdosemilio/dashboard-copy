import { NavigationExtras } from '@angular/router';
import { Action } from '@ngrx/store';

/**
 * Action Types
 */
export const GO = '@angular/router/go';
export const BACK = '@angular/router/back';
export const FORWARD = '@angular/router/forward';

/**
 * Actions
 */
export class Go implements Action {
  readonly type = GO;

  constructor(
    public payload: {
      path: any[];
      query?: object;
      extras?: NavigationExtras;
    }
  ) {}
}

export class Back implements Action {
  readonly type = BACK;
}

export class Forward implements Action {
  readonly type = FORWARD;
}

// Actions data type
export type Actions = Go | Back | Forward;
