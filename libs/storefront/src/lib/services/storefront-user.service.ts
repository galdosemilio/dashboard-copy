import { Injectable } from '@angular/core'
import { Router } from '@angular/router'
import {
  AccountProvider,
  ApiService,
  OrganizationPreference,
  OrganizationPreferenceSingle,
  Session,
  User
} from '@coachcare/sdk'
import { Store } from '@ngrx/store'
import { CCRState } from '@coachcare/backend/store'
import { OrgPrefActions } from '@coachcare/common/store/orgpreferences'
import {
  CurrentAccount,
  STORAGE_PROVIDER_URL
} from '@coachcare/common/services'

@Injectable()
export class StorefrontUserService {
  public user: CurrentAccount
  public preferences: OrganizationPreferenceSingle
  public orgId: string

  constructor(
    private api: ApiService,
    private store: Store<CCRState.State>,
    private router: Router,
    private orgPreference: OrganizationPreference,
    private profile: User,
    private account: AccountProvider,
    private session: Session
  ) {}

  public async init() {
    const params = new URLSearchParams(location.search)
    const token = params.get('token')
    this.orgId = params.get('baseOrg')

    const loggedIn = await this.isLoggedIn()

    if (token || loggedIn) {
      token && this.api.setToken(token) // set token to api
      await this.loadUserData()
    } else {
      await this.redirectToLogin()
    }
  }

  private async isLoggedIn() {
    try {
      const res = await this.session.check()
      return !!res.id
    } catch (err) {
      return false
    }
  }

  private async loadUserData() {
    try {
      const profile = await this.profile.get()

      this.user = await this.account.getSingle(profile.id)
      const prefs = await this.orgPreference.getAssets({
        id: this.orgId,
        mala: true
      })

      this.store.dispatch(
        new OrgPrefActions.UpdatePrefs({
          displayName: prefs.displayName,
          assets: prefs.assets,
          mala: prefs.mala,
          storeUrl: prefs.storeUrl
        })
      )

      this.preferences = await this.orgPreference.getSingle({ id: this.orgId })
      this.store.dispatch(new OrgPrefActions.UpdatePrefs(this.preferences))
    } catch (err) {
      await this.redirectToLogin()
    }
  }

  private async redirectToLogin() {
    window.localStorage.setItem(
      STORAGE_PROVIDER_URL,
      `${window.location.origin}/storefront`
    )
    await this.router.navigate(['../'])
  }
}
