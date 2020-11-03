import { Action } from '@ngrx/store';

import { UIResponsiveState } from './responsive.state';

/**
 * Action Types
 */
export const RES_UPDATE = '[UI] responsive/update';

/**
 * Actions
 */
export class UpdateResponsive implements Action {
  readonly type = RES_UPDATE;

  constructor(public payload: Partial<UIResponsiveState>) {}
}

// Actions data type
export type resActions = UpdateResponsive;
