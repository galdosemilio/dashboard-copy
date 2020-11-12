import { CCRConfig, CCRPalette } from '@app/config'
import { Action } from '@ngrx/store'

/**
 * Action Types
 */
export const INIT = '@app/config/init'
export const UPDATE = '@app/config/update'
export const PALETTE = '@app/config/palette'

/**
 * Actions
 */
export class InitConfig implements Action {
  readonly type = INIT

  constructor(public payload: CCRConfig) {}
}

export class UpdateConfig implements Action {
  readonly type = UPDATE

  constructor(public payload: Partial<CCRConfig>) {}
}

export class UpdatePalette implements Action {
  readonly type = PALETTE

  constructor(public payload: CCRPalette) {}
}

// Actions data type
export type Actions = InitConfig | UpdateConfig | UpdatePalette
