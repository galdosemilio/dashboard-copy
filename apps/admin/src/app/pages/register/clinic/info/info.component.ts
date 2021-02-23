import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output
} from '@angular/core'
import { FormControl, FormGroup } from '@angular/forms'
import { MatDialog } from '@coachcare/material'
import { ActivatedRoute } from '@angular/router'
import { resolveConfig } from '@board/pages/config/section.config'
import { _, FormUtils } from '@coachcare/common/shared'
import { CCRFacade } from '@coachcare/common/store/ccr'
import { ConfirmDialog } from '@coachcare/common/dialogs/core'
import {
  ContextService,
  COOKIE_LANG,
  CookieService,
  LanguageService
} from '@coachcare/common/services'
import { LOCALES } from '@coachcare/common/shared'
import { TranslateService } from '@ngx-translate/core'
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy'
import { AccountProvider } from '@coachcare/npm-api'
import { ClinicMsaProps } from '@coachcare/common/components'

@UntilDestroy()
@Component({
  selector: 'ccr-page-register-clinic-info',
  templateUrl: './info.component.html',
  styleUrls: ['./info.component.scss']
})
export class RegisterClinicInfoPageComponent implements OnInit, OnDestroy {
  @Input() formGroup: FormGroup
  @Input() orgName: { orgName: string }

  @Output() nextStep = new EventEmitter()

  accepted = false
  clinicMsa?: ClinicMsaProps
  clinicNewsletter: boolean
  clinicNewsletterCheckboxText?: string
  hideLanguageSelector = false
  newsletter: boolean
  numericPostalCode = false
  showNewsletterCheckbox = false

  constructor(
    private account: AccountProvider,
    private cookie: CookieService,
    private dialog: MatDialog,
    private language: LanguageService,
    private route: ActivatedRoute,
    private store: CCRFacade,
    private translate: TranslateService,
    public context: ContextService
  ) {}

  ngOnInit() {
    const clinicNewsletterConfig = resolveConfig(
      'REGISTER.CLINIC_NEWSLETTER_CHECKBOX_TEXT',
      this.context.organizationId
    )

    this.clinicNewsletterCheckboxText =
      typeof clinicNewsletterConfig === 'string'
        ? clinicNewsletterConfig
        : undefined

    this.showNewsletterCheckbox = !!resolveConfig(
      'REGISTER.NEWSLETTER_CHECKBOX',
      this.context.organizationId,
      true
    )

    this.resolveClinicMsa()

    this.route.queryParams.pipe(untilDestroyed(this)).subscribe((params) => {
      this.hideLanguageSelector =
        params.hasOwnProperty('hideLanguageSelector') &&
        params.hideLanguageSelector === 'true'
          ? true
          : false

      let selectedLanguage: string =
        params.hasOwnProperty('selectedLanguage') && params.selectedLanguage
          ? this.cookie.get(COOKIE_LANG)
            ? this.cookie.get(COOKIE_LANG)
            : params.selectedLanguage.toLowerCase()
          : this.cookie.get(COOKIE_LANG) || 'en'

      if (!LOCALES.find((local) => local.code === selectedLanguage)) {
        selectedLanguage = 'en'
      }

      const preferredLocales = this.formGroup.get(
        'account.preferredLocales'
      ) as FormControl
      preferredLocales.setValue([selectedLanguage])

      this.store.changeLang(selectedLanguage)
    })

    const country = this.formGroup.get(
      'organization.address.country'
    ) as FormControl
    country.setValue('')
    this.subscribeToEvents()
  }

  ngOnDestroy() {}

  onSubmit(): void {
    if (this.formGroup.valid) {
      const email = this.formGroup.get('account.email') as FormControl
      this.account
        .check({ email: email.value })
        .then(() => {
          this.dialog.open(ConfirmDialog, {
            data: {
              title: _('GLOBAL.ERROR'),
              content: _('NOTIFY.ERROR.EMAIL_ALREADY_REGISTERED')
            }
          })
        })
        .catch(() => this.nextStep.emit())
    } else {
      FormUtils.markAsTouched(this.formGroup)
      this.handleFormErrors()
    }
  }

  private handleFormErrors(): void {
    const err = this.formGroup.errors
      ? this.formGroup.errors.message
      : _('NOTIFY.ERROR.FILL_THE_FORM')

    this.dialog.open(ConfirmDialog, {
      data: {
        title: _('GLOBAL.ERROR'),
        content: err
      }
    })
  }

  private resolveClinicMsa(): void {
    const clinicMsaSetting = !!resolveConfig(
      'REGISTER.CLINIC_MSA',
      this.context.organizationId
    )

    if (!clinicMsaSetting) {
      return
    }

    const clinicMsaLinkSetting = resolveConfig(
      'REGISTER.CLINIC_MSA_LINK',
      this.context.organizationId
    )
    const clinicMsaLinkLabelSetting = resolveConfig(
      'REGISTER.CLINIC_MSA_LINK_LABEL',
      this.context.organizationId
    )

    this.clinicMsa = {
      link:
        typeof clinicMsaLinkSetting === 'string' ? clinicMsaLinkSetting : '',
      label:
        typeof clinicMsaLinkLabelSetting === 'string'
          ? clinicMsaLinkLabelSetting
          : ''
    }
  }

  private subscribeToEvents() {
    const preferredLocales = this.formGroup.get(
      'account.preferredLocales'
    ) as FormControl
    preferredLocales.valueChanges
      .pipe(untilDestroyed(this))
      .subscribe((lang) => {
        if (lang && lang[0] !== this.language.get()) {
          this.store.changeLang(lang[0])
        }
      })
    this.translate.onLangChange.pipe(untilDestroyed(this)).subscribe((lang) => {
      const cleanLang = Array.isArray(lang.lang) ? lang.lang : [lang.lang]
      preferredLocales.patchValue(cleanLang)
    })
  }
}
