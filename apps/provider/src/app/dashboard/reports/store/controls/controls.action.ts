import { Action } from '@ngrx/store';

import { ReportsCriteria } from '@app/dashboard/reports/services';

/**
 * Action Types
 */
export const UPDATE = 'REPORTS controls/update';

/**
 * Actions
 */
export class UpdateControls implements Action {
  readonly type = UPDATE;

  constructor(public payload: { criteria: ReportsCriteria }) {}
}

// Actions data type
export type Actions = UpdateControls;
