/**
 * Query Parameter options for the registration page
 * @param {String} [creditCard='optional', 'skip'] By default, the credit card page is shown and a card is required.
 *  It can be 'optional' (page shown but card not required) or 'skip' (not shown or enterable at all)
 * @param {Boolean} [hideLanguageSelector] If true, do not showing language selector (default to en-us)
 * @param {Boolean} [hideTitle] If true, hide the "let's build your coachcare platform" title
 * @param {Boolean} [hideSteps] If true, hide the 1-2-3 or 1-2 steps
 * @param {String} [selectedLanguage] Set selected language default (will work regardless of hideLanguageSelector setting)
 */
import {
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild
} from '@angular/core'
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators
} from '@angular/forms'
import {
  MAT_LABEL_GLOBAL_OPTIONS,
  MatDialog,
  MatStepper
} from '@coachcare/material'
import { ActivatedRoute, Router } from '@angular/router'
import { resolveConfig } from '@board/pages/config/section.config'
import { Register } from '@coachcare/npm-api'
import { _, FormUtils } from '@coachcare/common/shared'
import { CCRFacade } from '@coachcare/common/store/ccr'
import { BlockOption } from '@coachcare/common/components'
import { ConfirmDialog, LanguagesDialog } from '@coachcare/common/dialogs/core'
import {
  ContextService,
  COOKIE_LANG,
  CookieService,
  LanguageService
} from '@coachcare/common/services'
import { AppStoreFacade, OrgPrefState } from '@coachcare/common/store'
import { get } from 'lodash'
import * as moment from 'moment-timezone'
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy'
import { PlanSelectorSelectionEvent } from './clinic-packages'
import { LastStepComponentProps } from './last-step'

@UntilDestroy()
@Component({
  selector: 'ccr-page-register-clinic',
  templateUrl: './clinic.component.html',
  styleUrls: ['./clinic.component.scss'],
  providers: [
    { provide: MAT_LABEL_GLOBAL_OPTIONS, useValue: { float: 'never' } }
  ],
  host: {
    class: 'ccr-page-content'
  }
})
export class RegisterClinicPageComponent implements OnDestroy, OnInit {
  isLoading = false
  isOnLastStep = false
  orgName: Partial<OrgPrefState.State>
  lastStepSetup: LastStepComponentProps = {
    onlyFirstParagraph: false,
    showGoogleTagManager: false
  }
  logoUrl: string
  hideSteps: boolean
  hideTitle: boolean
  showClinicPackagesStep: boolean
  showLogo: boolean

  editable = true
  mobAppTypes: BlockOption[] = []
  paymentRequired: boolean | undefined = true
  plan: FormGroup
  step0: FormGroup
  step1: FormGroup
  step2: FormGroup

  @ViewChild('top', { static: false })
  top: ElementRef

  constructor(
    public context: ContextService,
    private cookie: CookieService,
    private dialog: MatDialog,
    private builder: FormBuilder,
    private register: Register,
    private org: AppStoreFacade,
    private language: LanguageService,
    private route: ActivatedRoute,
    private router: Router,
    private store: CCRFacade
  ) {
    this.org.pref$.subscribe((pref) => {
      this.logoUrl =
        pref.assets && pref.assets.logoUrl
          ? pref.assets.logoUrl
          : '/assets/logo.png'
      this.orgName = { displayName: pref.displayName || 'CoachCare' }
    })
  }

  ngOnDestroy() {}

  ngOnInit() {
    this.resolveGoogleTagManager()

    this.mobAppTypes = resolveConfig(
      'REGISTER.MOB_APP_TYPE',
      this.context.organizationId
    )
    this.showClinicPackagesStep =
      (
        resolveConfig(
          'REGISTER.CLINIC_PLANS',
          this.context.organizationId,
          true
        ) || []
      ).length > 0

    if (this.mobAppTypes && this.mobAppTypes.length) {
      this.mobAppTypes = this.mobAppTypes.map((mobAppType, index) => ({
        ...mobAppType,
        index
      }))
    }

    const newsletter = !!resolveConfig(
      'REGISTER.NEWSLETTER_CHECKBOX',
      this.context.organizationId,
      true
    )

    const openAssociationAddClient = !!resolveConfig(
      'REGISTER.OPEN_ASSOC_ADD_CLIENT',
      this.context.organizationId,
      true
    )

    const timezone = moment.tz.guess()
    // default to 'en' if the cookie does not have any language set
    const lang = [this.language.get() ? this.language.get() : 'en']

    this.plan = this.builder.group({
      type: ['', Validators.required],
      billingPeriod: ['']
    })

    this.step0 = this.builder.group({
      parentOrganizationId: ['', Validators.required]
    })

    this.step1 = this.builder.group(
      {
        organization: this.builder.group({
          openAssociationAddClient: [openAssociationAddClient],
          parentOrganizationId: this.context.organizationId,
          name: ['', Validators.required],
          newsletter: [newsletter],
          address: this.builder.group({
            street: ['', Validators.required],
            city: ['', Validators.required],
            state: [null, Validators.required],
            postalCode: ['', Validators.required],
            country: ['US', Validators.required]
          }),
          isActive: true
        }),
        account: this.builder.group({
          firstName: ['', Validators.required],
          lastName: ['', Validators.required],
          email: ['', [Validators.required, Validators.email]],
          phone: ['', Validators.required],
          timezone: timezone !== '' ? timezone : 'America/New_York',
          preferredLocales: [lang],
          isActive: true
        })
      },
      {
        validator: this.validateStep1
      }
    )

    this.step2 = this.builder.group({
      token: ['']
    })

    this.route.queryParams.pipe(untilDestroyed(this)).subscribe((params) => {
      const cookieLang = this.cookie.get(COOKIE_LANG)
      const queryLang =
        params.hasOwnProperty('selectedLanguage') &&
        params.selectedLanguage !== undefined
          ? params.selectedLanguage
          : undefined
      this.paymentRequired = params.hasOwnProperty('creditCard')
        ? params.creditCard === 'optional'
          ? false
          : params.creditCard === 'skip'
          ? undefined
          : true
        : true
      this.step2.controls.token.setValidators(
        this.paymentRequired ? Validators.required : null
      )
      this.hideSteps =
        params.hasOwnProperty('hideSteps') && params.hideSteps === 'true'
          ? false
          : true

      this.hideTitle =
        params.hasOwnProperty('hideTitle') && params.hideTitle === 'true'
          ? false
          : true

      if (cookieLang) {
        this.store.changeLang(cookieLang)
      } else if (queryLang) {
        this.store.changeLang(queryLang)
      } else {
        setTimeout(() => {
          this.dialog.open(LanguagesDialog, {
            data: {
              title: _('GLOBAL.SELECT_LANGUAGE')
            },
            panelClass: 'ccr-lang-dialog'
          })
        })
      }
    })

    this.showLogo = resolveConfig(
      'REGISTER.SHOW_REGISTER_ICON',
      this.context.organizationId
    )
  }

  validateStep1(step1: FormGroup) {
    const organization = step1.get('organization') as FormGroup
    const address = step1.get('organization.address') as FormGroup
    const account = step1.get('account') as FormGroup
    const email = account.controls.email

    const checker = (group: FormGroup) => {
      return (field: string) => {
        const control = group.get(field) as AbstractControl
        if (control instanceof FormGroup) {
          return false
        }
        return control.errors && control.errors.required
      }
    }

    if (
      Object.keys(account.controls).some(checker(account)) ||
      Object.keys(address.controls).some(checker(address)) ||
      Object.keys(organization.controls).some(checker(organization))
    ) {
      return { message: _('NOTIFY.ERROR.FILL_THE_FORM') }
    }

    if (email.errors && email.errors.email) {
      return { message: _('NOTIFY.ERROR.INVALID_EMAIL') }
    } else if (!/\S+@\S+\.\S+/.test(email.value)) {
      return { message: _('NOTIFY.ERROR.INVALID_EMAIL') }
    }
    return null
  }

  nextStep(stepper: MatStepper) {
    const stepsArray = stepper.steps.toArray()
    const nextStep = get(
      stepsArray[stepper.selectedIndex + 1],
      'content.elementRef.nativeElement.parentElement.dataset.name'
    )

    switch (nextStep) {
      case 'clinic_confirmation':
        this.isLoading = true
        // submit the form data to the API
        const data: any = { ...this.step1.value }

        data.organization.contact = {
          firstName: data.account.firstName,
          lastName: data.account.lastName,
          email: data.account.email,
          phone: data.account.phone
        }
        if (this.step2.value.token) {
          data.paymentData = {
            email: data.account.email,
            token: this.step2.value.token
          }
        }
        if (this.plan.valid) {
          data.plan = FormUtils.pruneEmpty(this.plan.value)
        }

        this.register
          .clinic(data)
          .then((res) => {
            this.isLoading = false
            this.editable = false

            if (data.plan) {
              this.lastStepSetup.registrationData = {
                plan: data.plan.type,
                clinicId: res.organizationId,
                billingTerm: data.plan.billingPeriod
              }
            }

            this.isOnLastStep = true
            this.changeStep(stepper, stepper._steps.length - 1)
          })
          .catch((err: string) => {
            this.isLoading = false
            this.dialog.open(ConfirmDialog, {
              data: {
                title: _('GLOBAL.ERROR'),
                content: err
              }
            })
          })
        break

      default:
        // organization and contact info completed
        this.changeStep(stepper, stepper.selectedIndex + 1)
        break
    }
  }

  onBlockOptionSelect($event: BlockOption): void {
    const targetOrgControl = this.step0.controls['parentOrganizationId']
    targetOrgControl.setValue($event.value)
    ;(this.step1.get(
      'organization.parentOrganizationId'
    ) as FormControl).setValue($event.value)

    this.lastStepSetup.onlyFirstParagraph = $event.index === 0 ? true : false
  }

  public onSelectPackageItem(selection: PlanSelectorSelectionEvent): void {
    this.lastStepSetup.clinicPlanMessage = selection.plan
      ? selection.plan.lastStepMessage
      : ''
    ;(this.step1.get(
      'organization.parentOrganizationId'
    ) as FormControl).setValue(
      selection.plan ? selection.plan.targetParentOrg : ''
    )
  }

  changeStep(stepper: MatStepper, step: number) {
    stepper.selectedIndex = step

    setTimeout(() => {
      if (this.top) {
        this.top.nativeElement.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        })
      }
    }, 25)
  }

  private resolveGoogleTagManager(): void {
    const showGoogleTagManager = resolveConfig(
      'REGISTER.SHOW_GOOGLE_TAG',
      this.context.organizationId,
      true
    )

    if (typeof showGoogleTagManager === 'object') {
      this.lastStepSetup.showGoogleTagManager = false
      return
    }

    this.lastStepSetup.showGoogleTagManager = showGoogleTagManager
  }
}
