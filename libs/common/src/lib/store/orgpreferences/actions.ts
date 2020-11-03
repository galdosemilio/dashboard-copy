import { OrganizationPreferenceSingle, OrgAssets } from '@coachcare/npm-api'
import { Action } from '@ngrx/store'

/**
 * Action Types
 */
export enum ActionTypes {
  ASSETS = '@orgprefs/assets',
  PREFS = '@orgprefs/prefs'
}

/**
 * Actions
 */
export class UpdateAssets implements Action {
  readonly type = ActionTypes.ASSETS

  constructor(public payload: OrgAssets) {}
}
export class UpdatePrefs implements Action {
  readonly type = ActionTypes.PREFS

  constructor(public payload: Partial<OrganizationPreferenceSingle>) {}
}

// Actions data type
export type Actions = UpdateAssets | UpdatePrefs
