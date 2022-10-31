import { Inject, Injectable } from '@angular/core'
import { Router } from '@angular/router'
import {
  AccountIdentifier,
  ApiService,
  Identifier,
  OrganizationPreference,
  OrganizationPreferenceSingle,
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
  catchError,
  throwError,
  forkJoin,
  iif,
  concatMap,
  EMPTY,
  share,
  filter
} from 'rxjs'
import { AppEnvironment, APP_ENVIRONMENT } from '@coachcare/common/shared'
import { _ } from '@coachcare/backend/shared'
import { TranslateService } from '@ngx-translate/core'
import { SPREE_EXTERNAL_ID_NAME } from './storefront.service'

@Injectable()
export class StorefrontUserService {
  public user: CurrentAccount
  public preferences: OrganizationPreferenceSingle
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
    private accountIdentifierService: AccountIdentifier,
    private profile: User,
    private session: Session,
    private translate: TranslateService
  ) {}

  public async init() {
    const params = new URLSearchParams(location.search)
    const token = params.get('token')
    this.orgId = params.get('baseOrg')

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
    return forkJoin({
      orgAssets: this.orgPreference.getAssets({
        id: this.orgId,
        mala: true
      }),
      orgPreference: this.orgPreference.getSingle({ id: this.orgId })
    }).pipe(
      tap(({ orgAssets, orgPreference }) => {
        this.storeUrl = orgPreference.storeUrl
        this.preferences = {
          displayName: orgAssets.displayName,
          assets: orgAssets.assets,
          mala: orgAssets.mala,
          storeUrl: orgAssets.storeUrl,
          ...orgPreference
        }
        this.store.dispatch(new OrgPrefActions.UpdatePrefs(this.preferences))
      }),
      switchMap(({ orgAssets, orgPreference }) =>
        iif(
          () =>
            orgPreference.storeUrl && this.validStore(orgPreference.storeUrl),
          of({ orgAssets, orgPreference }),
          this.getValidStoreUrl$
        )
      ),
      filter((res) => !!res),
      switchMap(() => this.profile.get()),
      tap((user) => {
        this.user = user
      }),
      switchMap((user) =>
        this.accountIdentifierService.fetchAll({
          account: user.id,
          organization: this.environment.defaultOrgId
        })
      ),
      switchMap((accountIdentifierService) =>
        iif(
          () => !!accountIdentifierService.data.length,
          of(accountIdentifierService.data),
          this.getDefaultAccountIdentifier$
        )
      ),
      tap((data) => {
        if (data[0]?.value) {
          this.accountIdentifier = data[0]
        }
      }),
      catchError((err) =>
        iif(
          () => err == 'Access to organization denied.',
          this.getAccessibleOrg$,
          throwError(() => new Error(err))
        )
      )
    )
  }

  private get getDefaultAccountIdentifier$() {
    return from(this.getAccessibleList$).pipe(
      switchMap((res) => from(res.data.map((org) => org.organization.id))),
      concatMap((id) =>
        this.accountIdentifierService.fetchAll({
          account: this.user.id,
          organization: id
        })
      ),
      map((res) =>
        res.data?.find(
          (identifier) =>
            identifier.name === SPREE_EXTERNAL_ID_NAME && identifier.value
        )
      ),
      takeWhile((identifier) => !identifier, true),
      last(),
      map((res) => iif(() => !res, EMPTY, this.addAccountIdentifier$(res)))
    )
  }

  private addAccountIdentifier$(res) {
    if (!res) return EMPTY

    return of(
      this.accountIdentifierService.add({
        account: this.user.id,
        organization: this.environment.defaultOrgId,
        name: SPREE_EXTERNAL_ID_NAME,
        value: res?.value
      })
    )
  }

  private get getValidStoreUrl$() {
    return from(this.getAccessibleList$).pipe(
      switchMap((res) => from(res.data.map((org) => org.organization.id))),
      concatMap((id) => this.orgPreference.getSingle({ id })),
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

  private get getAccessibleOrg$() {
    return from(this.getAccessibleList$).pipe(
      map((res) => {
        if (res.data.length) {
          const params = new URLSearchParams()
          params.set('baseOrg', res.data[0].organization.id)
          location.replace(`${location.pathname}?${params}`)
          return EMPTY
        }

        throw new Error('Access to organization denied.')
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
