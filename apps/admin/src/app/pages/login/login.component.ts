import { Component, forwardRef, Inject, OnDestroy, OnInit } from '@angular/core'
import { FormBuilder, FormGroup } from '@angular/forms'
import { MatDialog } from '@coachcare/material'
import { ActivatedRoute } from '@angular/router'
import { MFACodeInputMode } from '@board/shared/mfa-code-input'
import {
  AccountProvider,
  AccountTypeIds,
  DeviceTypeIds,
  LoginSessionRequest,
  LoginSessionResponse,
  MobileApp,
  Session,
  SessionRequest
} from '@coachcare/sdk'
import { _, FormUtils } from '@coachcare/backend/shared'
import { SessionActions } from '@coachcare/backend/store/session'
import { ConfirmDialog } from '@coachcare/common/dialogs/core'
import { BindForm, BINDFORM_TOKEN } from '@coachcare/common/directives'
import {
  ContextService,
  COOKIE_ROLE,
  CookieService,
  NotifierService,
  STORAGE_HIDE_REGISTER_COMPANY
} from '@coachcare/common/services'
import { APP_ENVIRONMENT, AppEnvironment } from '@coachcare/common/shared'
import { OrgPrefSelectors, OrgPrefState } from '@coachcare/common/store'
import { select, Store } from '@ngrx/store'
import { TranslateService } from '@ngx-translate/core'
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy'
import { resolveConfig } from '../config/section.config'
import { authenticationToken } from '@coachcare/common/sdk.barrel'

type LoginPageMode = 'patient'

@UntilDestroy()
@Component({
  selector: 'ccr-page-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  host: {
    class: 'ccr-page-card'
  },
  providers: [
    {
      provide: BINDFORM_TOKEN,
      useExisting: forwardRef(() => LoginPageComponent)
    }
  ]
})
export class LoginPageComponent implements BindForm, OnDestroy, OnInit {
  androidLink: string
  androidButtonLink: string
  form: FormGroup
  iosLink: string
  iosButtonLink: string
  isLoggingIn: boolean
  logoUrl: string
  mfaForm: FormGroup
  mode: MFACodeInputMode | LoginPageMode = 'default'
  orgName: string
  showRegisterCompany = false

  private cookieBasedSession = true

  constructor(
    @Inject(APP_ENVIRONMENT) private environment: AppEnvironment,
    private account: AccountProvider,
    private builder: FormBuilder,
    private context: ContextService,
    private cookie: CookieService,
    private dialog: MatDialog,
    private mobileApp: MobileApp,
    private notify: NotifierService,
    private route: ActivatedRoute,
    private session: Session,
    private store: Store<OrgPrefState.State>,
    private translate: TranslateService
  ) {
    this.store
      .pipe(select(OrgPrefSelectors.selectAssets))
      .subscribe((assets) => {
        this.logoUrl =
          assets && assets.logoUrl ? assets.logoUrl : '/assets/logo.png'
      })

    this.store
      .pipe(select(OrgPrefSelectors.selectOrgPref))
      .subscribe((prefs) => {
        this.orgName = prefs.displayName || ''
      })

    this.route.queryParams.pipe(untilDestroyed(this)).subscribe((params) => {
      const accountType = params.accountType

      if (accountType === AccountTypeIds.Client) {
        this.setMode('patient')
      }

      this.resolveRegisterNewCompanyLink(params)
    })
  }

  ngOnDestroy() {}

  ngOnInit() {
    this.form = this.builder.group({
      email: '',
      password: ''
    })

    this.cookieBasedSession =
      resolveConfig(
        'LOGIN.USE_COOKIE_BASED_SESSION',
        this.context.organizationId
      ) ?? true

    this.mfaForm = this.builder.group({})
    this.resolveBadgeLinks(
      this.translate.currentLang.split('-')[0].toLowerCase()
    )
    void this.resolveMobileAppRedirects()
    this.translate.onLangChange
      .pipe(untilDestroyed(this))
      .subscribe((translation: any) =>
        this.resolveBadgeLinks(translation.lang.split('-')[0].toLowerCase())
      )
    void this.checkExistingSession()
    this.isLoggingIn = false
  }

  setMode(mode: MFACodeInputMode | LoginPageMode): void {
    this.mode = mode
  }

  public async onSubmit(): Promise<void> {
    if (this.isLoggingIn) {
      return
    }

    if (this.form.valid) {
      const request: LoginSessionRequest = {
        ...this.form.value,
        deviceType: this.cookieBasedSession
          ? DeviceTypeIds.Web
          : DeviceTypeIds.iOS,
        allowedAccountTypes: [
          AccountTypeIds.Admin,
          AccountTypeIds.Provider,
          AccountTypeIds.Client
        ],
        organization:
          this.context.organizationId || this.environment.defaultOrgId
      }

      await this.attemptLogout()

      this.isLoggingIn = true
      this.session
        .login(request as SessionRequest)
        .then(async (response) => {
          if (response.token) {
            authenticationToken.value = response.token
          }

          if (response.mfa) {
            this.detectMFA(response as any) // MERGETODO: CHECK THIS TYPE!!!
          } else {
            const checkResponse = await this.session.check()
            const account = await this.account.getSingle(checkResponse.id)
            this.store.dispatch(new SessionActions.Login(account))
          }

          // let the store effect take care
          this.isLoggingIn = false
        })
        .catch((err: any) => {
          this.isLoggingIn = false
          if (
            err &&
            err.data &&
            err.data.code === 'mfa.instance.not-verified'
          ) {
            this.dialog.open(ConfirmDialog, {
              data: {
                title: _('GLOBAL.ERROR'),
                content: _('NOTIFY.ERROR.MFA_NOT_VERIFIED')
              }
            })
          } else {
            this.dialog.open(ConfirmDialog, {
              data: {
                title: _('GLOBAL.ERROR'),
                content: err.data ? err.data.message : err
              }
            })
          }
        })
    } else {
      FormUtils.markAsTouched(this.form)
    }
  }

  async onSubmitMFA() {
    try {
      if (this.isLoggingIn) {
        return
      }

      this.isLoggingIn = true
      const response = await this.session.loginMFA({
        ...this.form.value,
        deviceType: this.cookieBasedSession
          ? DeviceTypeIds.Web
          : DeviceTypeIds.iOS,
        allowedAccountTypes: [AccountTypeIds.Admin, AccountTypeIds.Provider],
        organization:
          this.context.organizationId || this.environment.defaultOrgId,
        token: {
          type: this.mode === 'backup_code' ? 'backup' : 'totp',
          value: this.mfaForm.value.code.code
            ? this.mfaForm.value.code.code.replace(/\s/g, '')
            : ''
        }
      })

      if (response.token) {
        authenticationToken.value = response.token
      }

      const checkResponse = await this.session.check()

      const account = await this.account.getSingle(checkResponse.id)
      this.store.dispatch(new SessionActions.Login(account))
    } catch (error) {
      this.notify.error(error)
    } finally {
      this.isLoggingIn = false
    }
  }

  private attemptLogout(): Promise<void> {
    return new Promise<void>(async (resolve) => {
      try {
        authenticationToken.value = undefined
        await this.session.logout()
      } finally {
        resolve()
      }
    })
  }

  private async checkExistingSession() {
    try {
      const sessionCookie = this.cookie.get(COOKIE_ROLE)
      if (sessionCookie) {
        const entity = await this.session.check()
        const account = await this.account.getSingle(entity.id)
        this.store.dispatch(new SessionActions.Login(account))
      }
    } catch (error) {
      // no action, the session was expired
    }
  }

  private async resolveMobileAppRedirects() {
    try {
      this.androidLink = (
        await this.mobileApp.getAndroidRedirect({
          id: this.context.organizationId || ''
        })
      ).redirect
    } catch (error) {}

    try {
      this.iosLink = (
        await this.mobileApp.getiOsRedirect({
          id: this.context.organizationId || ''
        })
      ).redirect
    } catch (error) {}
  }

  private detectMFA(response: LoginSessionResponse) {
    if (response.mfa) {
      switch (response.mfa.channel.id) {
        case '1':
          this.mode = 'auth'
          break
        case '2':
          this.mode = 'mfa_sms'
          break
        default:
          break
      }
    } else {
    }
  }

  private resolveBadgeLinks(lang: string) {
    this.androidButtonLink = `/assets/badges/${lang}-play-store-badge.png`
    this.iosButtonLink = `/assets/badges/${lang}-app-store-badge.png`
  }

  private resolveRegisterNewCompanyLink(params): void {
    const shouldShowRegisterCompany = resolveConfig(
      'LOGIN.SHOW_REGISTER_NEW_COMPANY',
      this.context.organizationId
    )

    if (!shouldShowRegisterCompany) {
      this.showRegisterCompany = false
      return
    }

    const storageValue = window.localStorage.getItem(
      STORAGE_HIDE_REGISTER_COMPANY
    )

    if (storageValue) {
      this.showRegisterCompany = false
      return
    }

    this.showRegisterCompany =
      params.hideRegisterCompany === 'true' ||
      params.hideRegisterCompany === true
        ? false
        : true

    if (!this.showRegisterCompany) {
      window.localStorage.setItem(STORAGE_HIDE_REGISTER_COMPANY, 'true')
    }
  }
}
