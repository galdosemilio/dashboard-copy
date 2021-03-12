import { Injectable } from '@angular/core'
import { Store } from '@ngrx/store'
import { findIndex, isEmpty, merge, pickBy } from 'lodash'
import { BehaviorSubject } from 'rxjs'
import {
  AccountProvider,
  CommunicationPreference,
  ContentPreference,
  MessagingPreference,
  OrganizationEntity,
  OrganizationProvider,
  RPM,
  Sequence,
  User
} from '@coachcare/npm-api'

import { CCRConfig, CCRPalette, Palette } from '@app/config'
import { InitLayout } from '@app/layout/store/layout'
import { UIState } from '@app/layout/store/state'
import {
  AccountAccessData,
  AccountAccessOrganization,
  AccountTypeIds,
  AccPreferencesResponse,
  AccSingleResponse,
  CommunicationPreferenceSingle,
  ContentPreferenceSingle,
  GetSeqOrgPreferenceResponse,
  MessagingOrgPreference,
  OrganizationPermission,
  OrganizationPreferences,
  OrganizationWithAddress,
  OrgPreferencesResponse,
  OrgSingleResponse,
  RPMPreferenceSingle
} from '@coachcare/npm-api'
import { UpdatePalette } from '@app/store/config'
import { AuthService } from './auth.service'
import { ConfigService } from './config.service'
import { EventsService } from './events.service'
import { LanguageService } from './language.service'
import { ApiService } from '@coachcare/npm-api/selvera-api/services'

interface CcrOrgPreferencesResponse extends OrgPreferencesResponse {
  comms: CommunicationPreferenceSingle
  fileVault: ContentPreferenceSingle
  messaging: MessagingOrgPreference
  rpm: RPMPreferenceSingle
  sequences: GetSeqOrgPreferenceResponse
}

export type CurrentAccount = AccSingleResponse & {
  preferences?: AccPreferencesResponse
}
export type SelectedAccount = AccSingleResponse
export type SelectedOrganization = OrganizationWithAddress & {
  permissions: Partial<OrganizationPermission>
  assets?: Partial<OrganizationPreferences>
  preferences?: Partial<CcrOrgPreferencesResponse>
  isDirect: boolean
  mala?: any
  // disabled?: boolean;
}

@Injectable()
export class ContextService {
  constructor(
    private api: ApiService,
    private store: Store<CCRConfig>,
    private ui: Store<UIState>,
    private accservice: AccountProvider,
    private communicationPrefs: CommunicationPreference,
    private contentPrefs: ContentPreference,
    private messagingPrefs: MessagingPreference,
    private orgservice: OrganizationProvider,
    private profile: User,
    private auth: AuthService,
    private config: ConfigService,
    private bus: EventsService,
    private lang: LanguageService,
    private rpm: RPM,
    private sequence: Sequence
  ) {
    // this.bus.register('organizations.disable-all', this.disableAll.bind(this));
    // this.bus.register('organizations.enable-all', this.enableAll.bind(this));
  }

  init() {
    return (): Promise<any> => {
      return new Promise((resolve, reject) => {
        this.lang.initLanguage()
        if (!this.auth.check()) {
          this.auth.redirect()
          reject()
        }
        this.ui.dispatch(new InitLayout())
        this.loadData().then(resolve)
      })
    }
  }

  /**
   * Logged User
   */
  async loadData(): Promise<boolean> {
    this.isOrphaned = false

    try {
      await this.updateUser()

      try {
        this.selected = this.user

        // check if associated to organizations
        try {
          const orgs = await this.orgservice.getAccessibleList({
            status: 'active',
            strict: false,
            limit: 'all'
          })
          this.organizations = orgs.data.map((o) => ({
            ...o.organization,
            permissions: o.permissions,
            isDirect: o.isDirect
          }))
        } catch (e) {
          console.error('No organizations associated!')
          this.updateColors({
            primary: '#f16862',
            accent: '#676a6c',
            toolbar: '#676a6c'
          })
          this.isOrphaned = true
          return false
        }

        if (!this.organizations.length) {
          console.error('No organizations associated!')
          this.updateColors({
            primary: '#f16862',
            accent: '#676a6c',
            toolbar: '#676a6c'
          })
          this.isOrphaned = true
          return false
        }

        // if (this.organizations.length > 1) {
        //   this.organizations.unshift({
        //     id: undefined,
        //     name: _('BOARD.ALL_ORGS'),
        //     disabled: false,
        //     permissions: {},
        //     preferences: {}
        //   });
        // }

        // check the user preferences
        let preferences: AccPreferencesResponse
        let defaultOrganization: string
        let org: SelectedOrganization

        if (this.user.preference && this.user.preference.defaultOrganization) {
          defaultOrganization = this.user.preference.defaultOrganization.toString()
          org = await this.getOrg(defaultOrganization)
        }
        if (!org) {
          org = this.getAccessibleOrg()
          defaultOrganization = org.id
        }
        preferences = merge({}, this.user.preference, { defaultOrganization })

        if (!this.user.preference && org.permissions.viewAll) {
          await this.accservice.savePreferences({
            account: this.user.id,
            ...preferences
          })
        }

        await this.updateOrganization(org)

        return true
      } catch (err) {
        // coudn't retrieve the account data
        console.error(err)
        return false
      }
    } catch (e) {
      // couldn't retrieve the current session
      this.auth.redirect()
      return false
    }
  }

  async updateUser() {
    // TODO remove profile call
    const profile = await this.profile.get(true)
    this.user = await this.accservice.getSingle(profile.id)
    this.lang.uid = profile.id
    if (this.user.preferredLocales.length) {
      this.lang.use(this.user.preferredLocales[0])
    }
    this.bus.trigger('user.data', this.user)
  }

  async updateOrganization(organization: any) {
    // MERGETODO: CHECK THIS TYPE!!!
    try {
      // fetch assets if they are not present
      if (!organization.preferences) {
        let prefs = await this.orgservice.getPreferences(organization.id, true)
        // handle default empty assets here
        const defprefs = {
          assets: { color: { primary: '#f05d5c', accent: '#f8b1b1' } }
        }
        prefs = merge({}, defprefs, prefs)
        organization.assets = prefs.assets
        organization.mala = prefs.mala || {}
        delete prefs.assets
        organization.preferences = prefs
      }

      const seqOrgPrefs = await this.resolveSeqOrgPreference(organization)
      const commsPrefs = await this.resolveCommsPreference(organization)
      const messagingPrefs = await this.resolveMessagingPreference(organization)
      const fileVaultPrefs = await this.resolveFileVaultPreference(organization)

      const rpmPrefs = await this.resolveRPMOrgPreference(organization)

      organization.preferences.rpm = rpmPrefs
      organization.preferences.sequences = seqOrgPrefs
      organization.preferences.comms = commsPrefs
      organization.preferences.messaging = messagingPrefs
      organization.preferences.fileVault = fileVaultPrefs
      // organization.preferences.sequences = { enabled: true };

      this.updateColors(organization.assets.color || {})

      if (organization.id && organization.permissions.viewAll) {
        // stores this org as default
        await this.accservice.updatePreferences({
          account: this.user.id,
          defaultOrganization: organization.id
        })
      }

      this.api.appendHeaders({ organization: organization.id })
    } catch (e) {}

    this.organization$.next(organization)
    this.accountOrg = this._updateAccountOrg()
  }

  updateColors(colors: any) {
    const palette: Partial<CCRPalette> = {
      primary: colors.primary,
      accent: colors.accent,
      toolbar: colors.toolbar ? colors.toolbar : Palette.toolbar
    }

    this.store.dispatch(
      new UpdatePalette(
        merge(
          {},
          Palette,
          pickBy(palette, (v) => !isEmpty(v))
        )
      )
    )
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
  //       this.updateOrganization(this.getAccessibleOrg());
  //     }
  //   }
  // }

  getProfileRoute(account: { id: any; accountType: any }) {
    if (account.id === this.user.id) {
      return '/profile'
    }

    const profileRoute = this.config.get('app.accountType.profileRoute')(
      account
    )
    return profileRoute
  }

  private getAccessibleOrg() {
    const allowed = this.organizations.find(
      (o) => o.permissions.viewAll === true
    )

    return allowed ? allowed : this.organizations[0]
  }

  /**
   * Orphaned AccountProvider - if this account has no orgs associated with it
   */
  orphanedAccount$ = new BehaviorSubject<boolean>(false)

  set isOrphaned(orphaned: boolean) {
    this.orphanedAccount$.next(orphaned)
  }

  get isOrphaned(): boolean {
    return this.orphanedAccount$.getValue()
  }

  /**
   * Current User
   */
  user: CurrentAccount

  /**
   * Selected User
   */
  selected$ = new BehaviorSubject<SelectedAccount>(null)

  set selected(user: SelectedAccount) {
    this.selected$.next(user)
  }
  get selected(): SelectedAccount {
    return this.selected$.getValue()
  }

  /**
   * Selected Clinic (mainly used for the Schedule Clinic Selector)
   */
  selectedClinic$: BehaviorSubject<OrganizationEntity> = new BehaviorSubject<OrganizationEntity>(
    null
  )

  set selectedClinic(clinic: OrganizationEntity) {
    this.selectedClinic$.next(clinic)
  }

  get selectedClinic(): OrganizationEntity {
    return this.selectedClinic$.getValue()
  }

  /**
   * Associated Organizations
   */
  organizations: Array<SelectedOrganization>

  /**
   * Current OrganizationProvider
   */
  organization$ = new BehaviorSubject<SelectedOrganization>(null)

  set organization(organization: SelectedOrganization) {
    this.updateOrganization(organization)
  }
  get organization(): SelectedOrganization {
    return this.organization$.getValue()
  }

  set organizationId(id: string | undefined) {
    this.getOrg(id)
      .then((organization) => this.updateOrganization(organization))
      .catch(console.error)
  }
  get organizationId(): string | undefined {
    const org = this.organization$.getValue()
    return org ? org.id : undefined
  }

  async getOrg(id: string): Promise<SelectedOrganization | null> {
    const organization = this.organizations.find((o) => o.id === id)
    if (organization) {
      return Promise.resolve(organization)
    }
    return this.orgservice
      .getSingle(id)
      .then((res) => {
        const assets = res.preferences.length ? res.preferences[0] : {}
        // handle default empty assets here
        const defprefs = {
          assets: { color: { primary: '#f05d5c', accent: '#f8b1b1' } }
        }
        merge(defprefs, { assets })
        // search for a parent permissions
        let perms
        res.hierarchyPath.some((hid) => {
          const horg = this.organizations.find((o) => o.id === hid)
          if (horg) {
            perms = horg.permissions
            return true
          }
        })
        // build resulting org
        const org: SelectedOrganization = {
          id: res.id,
          name: res.name,
          shortcode: res.shortcode,
          hierarchyPath: res.hierarchyPath,
          address: res.address,
          permissions: perms || {},
          assets: defprefs.assets,
          isDirect: false
        }
        this.organizations.push(org)
        return org
      })
      .catch(() => {
        const org: SelectedOrganization = {
          id: id,
          name: '',
          shortcode: '',
          hierarchyPath: [],
          address: {},
          permissions: {},
          assets: {},
          isDirect: false
        }
        this.organizations.push(org)
        return null
      })
  }
  async getPreferences() {
    const current = this.organization$.getValue()
    const organization: any = this.organizations.find(
      (o) => o.id === current.id
    ) //MERGETODO: CHECK THIS TYPE!!!
    if (organization.preferences) {
      return organization.preferences
    }
    let prefs = await this.orgservice.getPreferences(current.id)
    // handle default empty assets here
    const defprefs = {
      assets: { color: { primary: '#f05d5c', accent: '#f8b1b1' } }
    }
    prefs = merge({}, defprefs, prefs)
    organization.assets = prefs.assets
    delete prefs.assets
    organization.preferences = prefs
    return organization.preferences
  }
  async orgHasConference() {
    const prefs = await this.getPreferences()
    return prefs ? prefs.conference : false
  }
  async orgHasFoodMode(description: 'Meal' | 'Key-based'): Promise<number> {
    const prefs = await this.getPreferences()
    return prefs
      ? findIndex(prefs.food.mode, { description, isActive: true }) + 1
      : 0
  }
  async orgHasScheduleEnabled(accountType: AccountTypeIds) {
    const prefs = await this.getPreferences()
    return prefs
      ? !prefs.scheduling ||
          !prefs.scheduling.disabledFor ||
          !prefs.scheduling.disabledFor.length ||
          prefs.scheduling.disabledFor.indexOf(accountType) === -1
      : false
  }
  async orgHasContent() {
    const prefs = await this.getPreferences()
    return prefs ? prefs.content && prefs.content.enabled : false
  }
  async orgHasPerm(
    id: string,
    perm: keyof OrganizationPermission,
    direct: boolean = false
  ) {
    const org = await this.getOrg(id)
    return org && org.id
      ? direct
        ? org.isDirect && org.permissions[perm]
        : org.permissions[perm]
      : false
  }

  /**
   * Displayed AccountProvider
   */
  account$ = new BehaviorSubject<AccountAccessData>(null)

  accountOrg$ = merge(this.organization$, this.account$)
  accountOrg: string

  set account(user: AccountAccessData) {
    this.account$.next(user)
    this.accountOrg = this._updateAccountOrg()
  }
  get account(): AccountAccessData {
    return this.account$.getValue()
  }

  get accountId(): string | undefined {
    const account = this.account$.getValue()
    return account ? account.id : undefined
  }
  get accountOrgs(): Array<AccountAccessOrganization> {
    const account = this.account$.getValue()
    return account ? account.organizations : []
  }

  _updateAccountOrg() {
    const account = this.account$.getValue()
    if (!account) {
      return null
    }
    if (!this.organizationId) {
      return account.organizations.length ? account.organizations[0].id : null
    }
    // search the direct organization
    const i = findIndex(account.organizations, { id: this.organizationId })
    if (i >= 0) {
      return account.organizations[i].id
    } else {
      // search inside the hierarchy
      this.organizations.forEach((org) => {
        account.organizations.forEach((aorg) => {
          if (org.hierarchyPath && org.hierarchyPath.indexOf(aorg.id) >= 0) {
            return aorg.id
          }
        })
      })
    }
    return account.organizations[0].id
  }

  /**
   * Displayed clinic
   */

  public clinic$: BehaviorSubject<OrgSingleResponse> = new BehaviorSubject<OrgSingleResponse>(
    null
  )

  set clinic(clinic: any) {
    this.clinic$.next(clinic)
  }

  get clinic(): any {
    return this.clinic$.getValue()
  }

  private resolveCommsPreference(
    organization: SelectedOrganization
  ): Promise<CommunicationPreferenceSingle> {
    return new Promise<CommunicationPreferenceSingle>(async (resolve) => {
      try {
        const communicationPrefs = await this.communicationPrefs.getPreferenceByOrg(
          {
            organization: organization.id
          }
        )
        resolve(communicationPrefs)
      } catch (error) {
        resolve(undefined)
      }
    })
  }

  private resolveFileVaultPreference(
    organization: SelectedOrganization
  ): Promise<ContentPreferenceSingle> {
    return new Promise<ContentPreferenceSingle>(async (resolve) => {
      try {
        const fileVaultPrefs = await this.contentPrefs.getContentVaultPreference(
          {
            organization: organization.id
          }
        )
        resolve(fileVaultPrefs)
      } catch (error) {
        resolve(undefined)
      }
    })
  }

  private resolveMessagingPreference(
    organization: SelectedOrganization
  ): Promise<MessagingOrgPreference> {
    return new Promise<MessagingOrgPreference>(async (resolve) => {
      try {
        const messagingPrefs = await this.messagingPrefs.getOrgPreference({
          organization: organization.id
        })
        resolve(messagingPrefs)
      } catch (error) {
        resolve(undefined)
      }
    })
  }

  private resolveRPMOrgPreference(
    organization: SelectedOrganization
  ): Promise<RPMPreferenceSingle> {
    return new Promise<RPMPreferenceSingle>(async (resolve) => {
      try {
        const rpmPrefs = await this.rpm.getRPMPreferenceByOrg({
          organization: organization.id
        })
        resolve(rpmPrefs)
      } catch (error) {
        resolve(undefined)
      }
    })
  }

  private resolveSeqOrgPreference(
    organization: SelectedOrganization
  ): Promise<GetSeqOrgPreferenceResponse> {
    return new Promise<GetSeqOrgPreferenceResponse>(async (resolve) => {
      try {
        const sequencePrefs = await this.sequence.getSeqOrgPreferenceByOrg({
          organization: organization.id
        })
        resolve(sequencePrefs)
      } catch (error) {
        resolve(undefined)
      }
    })
  }
}
