import { Inject, Injectable } from '@angular/core'
import { Router } from '@angular/router'
import {
  ApiService,
  GetAssetsOrganizationPreferenceResponse,
  Identifier,
  OrganizationPreference,
  OrganizationProvider,
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
import {
  from,
  lastValueFrom,
  map,
  of,
  switchMap,
  takeWhile,
  tap,
  last,
  iif,
  concatMap,
  EMPTY,
  share,
  filter
} from 'rxjs'
import { AppEnvironment, APP_ENVIRONMENT } from '@coachcare/common/shared'
import { _ } from '@coachcare/backend/shared'
import { TranslateService } from '@ngx-translate/core'

const customStore = {
  orgs: ['3328', '7277', '7283', '7282'],
  url: 'https://sharp.myclinicshop.com/'
}

@Injectable()
export class StorefrontUserService {
  public user: CurrentAccount
  public preferences: GetAssetsOrganizationPreferenceResponse
  public orgId: string
  public storeUrl: string
  public accountIdentifier: Identifier
  static readonly whitelistedHosts: RegExp =
    /coachcare.local|ecommerce.coachcare/i

  constructor(
    @Inject(APP_ENVIRONMENT) private environment: AppEnvironment,
    private api: ApiService,
    private store: Store<CCRState.State>,
    private router: Router,
    private orgPreference: OrganizationPreference,
    private orgProvider: OrganizationProvider,
    private profile: User,
    private session: Session,
    private translate: TranslateService
  ) {}

  public async init() {
    const params = new URLSearchParams(location.search)
    const token = params.get('token')
    this.orgId = params.get('baseOrg')

    if (customStore.orgs.includes(this.orgId)) {
      window.location.href = customStore.url
      return
    }

    const loggedIn = await this.isLoggedIn()

    if (token || loggedIn) {
      token && this.api.setToken(token) // set token to api
      try {
        await lastValueFrom(this.loadUserData(), { defaultValue: 'completed' })
      } catch (err) {
        throw new Error(err)
      }
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

  private loadUserData() {
    return from(
      this.orgPreference.getAssets({
        id: this.orgId,
        mala: true
      })
    ).pipe(
      tap((orgAssets: GetAssetsOrganizationPreferenceResponse) => {
        this.storeUrl = orgAssets.storeUrl
        this.preferences = {
          id: orgAssets.id,
          displayName: orgAssets.displayName,
          assets: orgAssets.assets,
          mala: orgAssets.mala,
          storeUrl: orgAssets.storeUrl
        }
        this.store.dispatch(new OrgPrefActions.UpdatePrefs(this.preferences))
      }),
      switchMap((orgAssets) =>
        iif(
          () => orgAssets.storeUrl && this.validStore(orgAssets.storeUrl),
          of(orgAssets),
          this.getValidStoreUrl$
        )
      ),
      filter((res) => !!res),
      switchMap(() => this.profile.get()),
      tap((user) => {
        this.user = user
      })
    )
  }

  private get getValidStoreUrl$() {
    return from(this.getAccessibleList$).pipe(
      switchMap((res) => from(res.data.map((org) => org.organization.id))),
      concatMap((id) =>
        this.orgPreference.getAssets({
          id,
          mala: true
        })
      ),
      takeWhile(({ storeUrl }) => !this.validStore(storeUrl), true),
      last(),
      switchMap(({ id, storeUrl }) => {
        if (!this.validStore(storeUrl)) {
          return this.translate.get(_('ERROR.STORE_NOT_AVAILABLE'))
        }

        const params = new URLSearchParams()
        params.set('baseOrg', id)
        location.replace(`${location.pathname}?${params}`)
        return EMPTY
      }),
      map((message) => {
        throw message
      })
    )
  }

  private get getAccessibleList$() {
    return from(this.orgProvider.getAccessibleList({})).pipe(share())
  }

  private validStore(storeUrl) {
    return !!storeUrl && StorefrontUserService.whitelistedHosts.test(storeUrl)
  }

  private async redirectToLogin() {
    window.localStorage.setItem(
      STORAGE_PROVIDER_URL,
      `${window.location.origin}/storefront`
    )
    await this.router.navigate(['../'])
  }
}
