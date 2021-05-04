// tslint:disable:member-ordering
import { Inject, Injectable } from '@angular/core'
import {
  AccountAccessData,
  AccountAssociationData,
  AccountPreference,
  AccountPreferenceSingle,
  AccountSingle,
  AccountTypeIds,
  AllOrgPermissions,
  OrganizationProvider,
  OrganizationPreference,
  OrganizationPreferenceSingle,
  OrgEntity
} from '@coachcare/sdk'
import { CCRSelectors, CCRState } from '@coachcare/backend/store'
import { OrgPrefActions } from '@coachcare/common/store'
import { select, Store } from '@ngrx/store'
import { findIndex, merge } from 'lodash'
import { BehaviorSubject } from 'rxjs'
import { skipWhile } from 'rxjs/operators'
import { APP_ENVIRONMENT, AppEnvironment, loc2API, locales } from '../shared'
import {
  COOKIE_LANG,
  COOKIE_ORG,
  COOKIE_ORG_EXP,
  CookieService
} from './cookie.service'
import { LanguageService } from './language.service'

export type CurrentAccount = AccountSingle & {
  preference?: AccountPreferenceSingle
}

export type SelectedAccount = AccountSingle

export type SelectedOrganization = Partial<OrgEntity> & {
  disabled?: boolean
  permissions?: Partial<AllOrgPermissions>
  preferences?: OrganizationPreferenceSingle
}

/**
 * Context Service
 */
@Injectable()
export class ContextService {
  // current user
  user: CurrentAccount
  site: string

  constructor(
    @Inject(APP_ENVIRONMENT) private environment: AppEnvironment,
    private accpref: AccountPreference,
    private org: OrganizationProvider,
    private orgpref: OrganizationPreference,
    private cookie: CookieService,
    private lang: LanguageService,
    private store: Store<CCRState.State>
  ) {}

  init() {
    return (): Promise<any> => {
      // Fetch baseOrgId from URL params
      let urlParams = this.resolveUrlParams()
      let baseOrgId = urlParams.baseOrg ? urlParams.baseOrg || null : null
      const cookieOrgId = this.cookie.get(COOKIE_ORG)

      // Check if the baseOrgId is different from what we have in the cookie
      if (baseOrgId && cookieOrgId !== baseOrgId) {
        this.cookie.set(COOKIE_ORG, baseOrgId, COOKIE_ORG_EXP, '/')
        window.location.reload()
        return undefined as any
      }

      // process manually the route /:organization[/.*]
      const uri = location.pathname.split('/')
      const length = uri.length

      if (uri[1] && locales.map(loc2API).indexOf(uri[1]) !== -1) {
        // check for locale setting
        this.cookie.set(COOKIE_LANG, uri[1], COOKIE_ORG_EXP, '/')
        uri.splice(1, 1)
      }

      if (uri[1] && !isNaN(Number(uri[1]))) {
        // save the cookie and redirect
        baseOrgId = uri[1]
        this.cookie.set(COOKIE_ORG, uri[1], COOKIE_ORG_EXP, '/')
        uri.splice(1, 1)
      }

      if (uri.length !== length) {
        if (!urlParams.baseOrg) {
          urlParams.baseOrg = baseOrgId
        }
        location.href =
          uri.join('/') +
          `?${Object.keys(urlParams)
            .map((key) => key + '=' + urlParams[key] + '&')
            .join('')}`
        return undefined as any
      }

      if (!cookieOrgId && !baseOrgId) {
        if (urlParams) {
          urlParams['baseOrg'] = this.environment.defaultOrgId
        } else {
          urlParams = {
            baseOrg: this.environment.defaultOrgId
          }
        }
        this.cookie.set(
          COOKIE_ORG,
          this.environment.defaultOrgId,
          COOKIE_ORG_EXP,
          '/'
        )
        location.href =
          uri.join('/') +
          `?${Object.keys(urlParams)
            .map((key) => key + '=' + urlParams[key] + '&')
            .join('')}`
      } else if (!baseOrgId || cookieOrgId !== baseOrgId) {
        if (urlParams) {
          urlParams['baseOrg'] = cookieOrgId
        } else {
          urlParams = {
            baseOrg: this.environment.defaultOrgId
          }
        }
        location.href =
          uri.join('/') +
          `?${Object.keys(urlParams)
            .map((key) => key + '=' + urlParams[key] + '&')
            .join('')}`
      }

      // app initialization promise
      return new Promise<void>((resolve, reject) => {
        // TODO review lang initialization
        this.lang.init()

        // subscribe to the store language changes
        // TODO move this to @coachcare/common effects
        this.store
          .pipe(
            select(CCRSelectors.selectData),
            skipWhile((state) => !state.session.loaded)
          )
          .subscribe((data) => {
            if (data.session.language) {
              this.lang.set(data.session.language)
            }
          })

        // wait till the session is loaded
        this.store
          .pipe(
            select(CCRSelectors.selectData),
            skipWhile((state) => !state.session.loaded)
          )
          .subscribe(async (state) => {
            try {
              let org: SelectedOrganization

              this.site = state.session.account

              switch (state.session.account) {
                case 'provider':
                  // initialize the user information
                  this.user = { ...state.user }
                  this.selected = { ...state.user }

                  // fetch associated organizations
                  try {
                    const orgs = await this.org.getAccessibleList({
                      status: 'active',
                      strict: false,
                      limit: 'all'
                    })
                    this.organizations = orgs.data.map((o: any) => ({
                      // MERGETODO: CHECK THIS TYPE OUT!!!
                      ...o.organization,
                      permissions: o.permissions
                    }))
                  } catch (e) {
                    reject('No organizations associated!')
                    return
                  }

                  if (!this.organizations.length) {
                    reject('No organizations associated!')
                    return
                  }

                  // if (this.organizations.length > 1) {
                  //   this.organizations.unshift({
                  //     id: undefined,
                  //     name: _('GLOBAL.ALL_ORGS'),
                  //     disabled: false,
                  //     permissions: {},
                  //     preferences: {}
                  //   });
                  // }

                  // check the user preferences
                  let preferences: AccountPreferenceSingle
                  let defaultOrganization: string

                  if (
                    this.user.preference &&
                    this.user.preference.defaultOrganization
                  ) {
                    defaultOrganization = this.user.preference.defaultOrganization.toString()
                    org = this.resolveDefaultOrg(defaultOrganization)
                  } else {
                    org = this.resolveDefaultOrg()
                  }

                  // save the default organization if no preference exists
                  if (
                    !this.user.preference &&
                    (!org.permissions || org.permissions.viewAll)
                  ) {
                    preferences = merge({}, this.user.preference, {
                      defaultOrganization: org.id
                    })

                    await this.accpref.create({
                      id: this.user.id,
                      ...preferences
                    })
                  }

                  await this.updateOrganization(org)
                  break

                case 'admin':
                  // initialize the user information
                  this.user = { ...state.user }
                  this.selected = { ...state.user }
                  await this.checkOrgByCookie()
                  break

                default:
                  this.user = this.selected = {} as AccountSingle
                  this.organizations = []
                  await this.checkOrgByCookie()
              }
              resolve()
            } catch (e) {
              reject(e)
            }
          })
      })
    }
  }

  async updateOrganization(org?: SelectedOrganization) {
    if (!org || !org.id) {
      return
    }

    try {
      // fetch assets if they are not present
      if (!org.preferences) {
        org.preferences = await this.orgpref.getSingle({ id: org.id })
      }

      this.store.dispatch(new OrgPrefActions.UpdatePrefs(org.preferences))

      if (
        this.user &&
        org.id &&
        (!org.permissions || org.permissions.viewAll)
      ) {
        // stores this org as default
        await this.accpref.update({
          id: this.user.id,
          defaultOrganization: org.id
        })
      }
    } catch (e) {}

    this._organizationId = org.id
    this.accountOrg = this.updateAccountOrg()
    this.organization$.next(org)
  }

  // enableAll() {
  //   if (this.organizations.length > 1 && this.organizations[0].disabled) {
  //     this.organizations[0] = {
  //       ...this.organizations[0],
  //       disabled: false
  //     };
  //   }
  // }

  // disableAll() {
  //   if (this.organizations.length > 1 && !this.organizations[0].disabled) {
  //     this.organizations[0] = {
  //       ...this.organizations[0],
  //       disabled: true
  //     };
  //     if (!this.organizationId) {
  //       this.updateOrganization(this.resolveDefaultOrg());
  //     }
  //   }
  // }

  /**
   * Selected User.
   */
  selected$ = new BehaviorSubject<SelectedAccount>({} as SelectedAccount)

  set selected(user: SelectedAccount) {
    this.selected$.next(user)
  }
  get selected(): SelectedAccount {
    return this.selected$.getValue()
  }

  /**
   * Associated Organizations
   */
  organizations: Array<SelectedOrganization> = []

  /**
   * Current OrganizationProvider
   */
  organization$ = new BehaviorSubject<SelectedOrganization>(
    {} as SelectedOrganization
  )

  set organization(organization: SelectedOrganization) {
    this.updateOrganization(organization)
  }
  get organization(): SelectedOrganization {
    return this.organization$.getValue()
  }

  _organizationId: string | undefined

  set organizationId(id: string | undefined) {
    if (this.organizations.length) {
      // if organizations are loaded, update preferences and assets
      const organization = this.organizations.find((o) => o.id === id)
      this.updateOrganization(organization)
    } else {
      // direct assign for guests
      this._organizationId = id
    }
  }
  get organizationId(): string | undefined {
    return this._organizationId
  }

  orgHasFoodMode(description: 'Meal' | 'Key-based'): number {
    const org = this.organization$.getValue()
    return org && org.id && org.preferences
      ? findIndex(org.preferences.food.mode, { description, isActive: true }) +
          1
      : 0
  }
  orgHasScheduleEnabled(accountType: AccountTypeIds) {
    const org = this.organization$.getValue()
    return org && org.id && org.preferences
      ? !org.preferences.scheduling ||
          !org.preferences.scheduling.disabledFor ||
          !org.preferences.scheduling.disabledFor.length ||
          org.preferences.scheduling.disabledFor.indexOf(accountType) === -1
      : false
  }

  private resolveDefaultOrg(defaultOrg?: string | undefined) {
    let allowed: SelectedOrganization | undefined

    if (this.cookie.check(COOKIE_ORG)) {
      const id = this.cookie.get(COOKIE_ORG)
      allowed = this.organizations.find((o) => o.id === id)
    }

    if (!allowed && defaultOrg) {
      allowed = this.organizations.find((o) => o.id === defaultOrg)
    }

    if (!allowed) {
      allowed = this.organizations.find(
        (o) => !o.permissions || o.permissions.viewAll === true
      )
    }

    return allowed ? allowed : this.organizations[0]
  }

  /**
   * Displayed Account
   */
  account$ = new BehaviorSubject<AccountAccessData>({} as AccountAccessData)

  accountOrg$ = merge(this.organization$, this.account$)
  accountOrg: string

  set account(user: AccountAccessData) {
    this.account$.next(user)
    this.accountOrg = this.updateAccountOrg()
  }
  get account(): AccountAccessData {
    return this.account$.getValue()
  }

  get accountId(): string | undefined {
    const account = this.account$.getValue()
    return account ? account.id : undefined
  }
  get accountOrgs(): Array<AccountAssociationData> {
    const account = this.account$.getValue()
    return account ? account.organizations : ([] as any) // MERGETODO: CHECK THIS TYPE OUT!!!
  }

  private updateAccountOrg() {
    const account = this.account$.getValue()
    if (!account || !account.organizations) {
      return ''
    }
    if (!this.organizationId) {
      return account.organizations.length ? account.organizations[0].id : ''
    }
    // search the direct organization
    const i = findIndex(account.organizations, { id: this.organizationId })
    if (i < 0) {
      // search inside the hierarchy
      this.organizations.forEach((org) => {
        account.organizations.forEach((aorg) => {
          if (org.hierarchyPath && org.hierarchyPath.indexOf(aorg.id) !== -1) {
            return aorg.id
          }
        })
      })
    }
    return i >= 0 ? account.organizations[i].id : account.organizations[0].id
  }

  private async checkOrgByCookie() {
    if (this.cookie.check(COOKIE_ORG)) {
      const id = this.cookie.get(COOKIE_ORG)
      if (id) {
        try {
          const prefs = await this.orgpref.getAssets({ id, mala: true })
          this.store.dispatch(
            new OrgPrefActions.UpdatePrefs({
              displayName: prefs.displayName,
              assets: prefs.assets,
              mala: prefs.mala
            })
          )
          this._organizationId = id
          this.lang.localesBlacklist = prefs.mala.localesBlacklist || []
        } catch (e) {}
      }
    }
  }

  private resolveUrlParams(): any {
    const urlParams = {}
    const splitUrl = location.href.split('?')
    if (splitUrl.length > 1) {
      const rawParams = splitUrl[1]
      const splitParams = rawParams.split('&')

      splitParams.forEach((splitParam) => {
        const prop = splitParam.split('=')[0]
        const value = splitParam.split('=')[1]

        urlParams[prop] = value
      })
    }

    return urlParams
  }
}
