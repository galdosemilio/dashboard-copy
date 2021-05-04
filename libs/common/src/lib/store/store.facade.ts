import { Injectable } from '@angular/core'
import { select, Store } from '@ngrx/store'

import { OrganizationPreferenceSingle, OrgAssets } from '@coachcare/sdk'
import {
  OrgPrefActions,
  OrgPrefSelectors,
  OrgPrefState
} from './orgpreferences'

@Injectable()
export class AppStoreFacade {
  // Expose Queries

  // org preferences
  name$ = this.org.pipe(select(OrgPrefSelectors.getName))
  assets$ = this.org.pipe(select(OrgPrefSelectors.getAssets))
  colors$ = this.org.pipe(select(OrgPrefSelectors.getColors))
  pref$ = this.org.pipe(select(OrgPrefSelectors.selectOrgPref))

  constructor(private org: Store<OrgPrefState.State>) {}

  // API
  updateAssets(assets: OrgAssets) {
    this.org.dispatch(new OrgPrefActions.UpdateAssets(assets))
  }

  dispatch(prefs: OrganizationPreferenceSingle) {
    this.org.dispatch(new OrgPrefActions.UpdatePrefs(prefs))
  }
}
