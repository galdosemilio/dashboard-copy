import {
  Component,
  forwardRef,
  Input,
  OnInit,
  ViewEncapsulation
} from '@angular/core'
import {
  AbstractControl,
  ControlValueAccessor,
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  NG_VALUE_ACCESSOR,
  ValidatorFn,
  Validators
} from '@angular/forms'
import { authenticationToken } from '@coachcare/common/sdk.barrel'
import {
  ContextService,
  CookieService,
  COOKIE_ROLE,
  ECOMMERCE_ACCESS_TOKEN,
  ECOMMERCE_REFRESH_TOKEN,
  EventsService,
  LanguageService,
  NotifierService
} from '@coachcare/common/services'
import { SelectorOption, _ } from '@coachcare/common/shared'
import {
  AccountIdentifier,
  AccountProvider,
  AccSingleResponse,
  AddLogRequest,
  CcrRolesMap,
  DeviceTypeIds,
  Logging,
  Register,
  SpreeProvider,
  User
} from '@coachcare/sdk'
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy'
import { environment } from '../../../../environments/environment'
import { range, uniqBy } from 'lodash'
import * as moment from 'moment'
import { DeviceDetectorService } from 'ngx-device-detector'
import * as owasp from 'owasp-password-strength-test'
import { filter } from 'rxjs/operators'
import { Client } from '@spree/storefront-api-v2-sdk'
import { IOAuthToken } from '@spree/storefront-api-v2-sdk/types/interfaces/Token'
import { merge } from 'rxjs'

const SPREE_EXTERNAL_ID_NAME = 'Spree ID'

export interface AdditionalConsentButtonEntry {
  text: string
  links: { text: string; url: string }[]
}

export interface CheckoutAccountInfo {
  id?: string
  firstName: string
  lastName: string
  email: string
  emailConfirmation: string
  password: string
  passwordConfirmation: string
  phoneNumber: string
  gender: string
  height: string
  heightDisplayValue?: string
  birthday: Date
}

@UntilDestroy()
@Component({
  selector: 'ccr-checkout-account-info',
  templateUrl: './account-info.component.html',
  styleUrls: ['./account-info.component.scss'],
  encapsulation: ViewEncapsulation.None,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CheckoutAccountComponent),
      multi: true
    }
  ]
})
export class CheckoutAccountComponent implements ControlValueAccessor, OnInit {
  @Input() accountCreated = false
  @Input() set additionalConsentButtons(
    addConsButton: AdditionalConsentButtonEntry[]
  ) {
    this._additionalConsentButtons = addConsButton ?? []
    this.regenerateAdditionalConsentForm()
  }

  get additionalConsentButtons(): AdditionalConsentButtonEntry[] {
    return this._additionalConsentButtons
  }

  @Input() hasStoreUrl: boolean
  @Input() spree: Client
  @Input() spreeToken: IOAuthToken
  @Input() storeUrl: string

  public account: AccSingleResponse
  public additionalConsentForm: FormArray
  public form: FormGroup
  public isMobileDevice: boolean
  public genders: SelectorOption[] = [
    { value: 'male', viewValue: _('SELECTOR.GENDER.MALE') },
    { value: 'female', viewValue: _('SELECTOR.GENDER.FEMALE') }
  ]
  public heights: SelectorOption[] = []
  public shouldShowPassHint = false
  public startDate = new Date(1960, 0, 1)

  private _additionalConsentButtons: AdditionalConsentButtonEntry[] = []
  private propagateChange: (value: CheckoutAccountInfo) => void
  private propagateTouched: () => void

  constructor(
    private accountIdentifier: AccountIdentifier,
    private accountProvider: AccountProvider,
    private bus: EventsService,
    private cookie: CookieService,
    private context: ContextService,
    private deviceDetector: DeviceDetectorService,
    private fb: FormBuilder,
    private lang: LanguageService,
    private log: Logging,
    private notifier: NotifierService,
    private register: Register,
    private spreeProvider: SpreeProvider,
    private user: User
  ) {
    this.validatePassword = this.validatePassword.bind(this)
  }

  public ngOnInit(): void {
    this.isMobileDevice = this.deviceDetector.isMobile()
    this.createForm()
    this.generateHeights()
    this.subscribeToFormEvents()
  }

  public markAllAsTouched(): void {
    this.form.markAllAsTouched()
    this.additionalConsentForm.markAllAsTouched()
  }

  public onBlurPasswordField(): void {
    this.shouldShowPassHint = false
  }

  public onFocusPasswordField(): void {
    this.shouldShowPassHint = true
  }

  public registerOnChange(fn): void {
    this.propagateChange = fn
  }

  public registerOnTouched(fn): void {
    this.propagateTouched = fn
  }

  public setDisabledState(isDisabled: boolean): void {
    if (isDisabled) {
      this.form.disable()
    } else {
      this.form.enable()
    }
  }

  public async submit(): Promise<void> {
    try {
      if (!this.accountCreated) {
        await this.createUserAccount()
      } else {
        await this.updateUserAccount()
      }
    } catch (error) {
      this.notifier.error(error)
      throw new Error(error)
    }
  }

  public writeValue(obj: CheckoutAccountInfo): void {
    if (!this.form || !obj) {
      return
    }

    this.form.patchValue(obj)
  }

  private async attemptLogout(): Promise<void> {
    try {
      await this.user.logout()
    } catch (error) {}
  }

  private convertCentimetersToFeetInches(centimeters: number): string {
    const product = centimeters / 0.0254 / 100
    const ft = Math.floor(product / 12)
    const inch = Math.floor(product % 12)

    return `${ft}’${inch}"`
  }

  private createForm(): void {
    this.form = this.fb.group({
      id: [''],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      emailConfirmation: [
        '',
        [
          Validators.required,
          Validators.email,
          this.validateFieldMatches('email')
        ]
      ],
      password: ['', [Validators.required, this.validatePassword]],
      passwordConfirmation: [
        '',
        [Validators.required, this.validateFieldMatches('password')]
      ],
      phoneNumber: ['', Validators.required],
      gender: ['', [Validators.required]],
      height: ['', Validators.required],
      heightDisplayValue: [''],
      birthday: ['', [Validators.required]],
      agreements: [false, [Validators.requiredTrue]]
    })

    this.form
      .get('password')
      .valueChanges.pipe(untilDestroyed(this))
      .subscribe(() =>
        this.form.get('passwordConfirmation').updateValueAndValidity()
      )
  }

  private async createUserAccount(): Promise<void> {
    try {
      this.bus.trigger('checkout.loading.show', true)
      const accountData = this.form.value

      await this.attemptLogout()

      const single = await this.register.client({
        organization: this.context.organizationId,
        firstName: accountData.firstName,
        lastName: accountData.lastName,
        email: accountData.email,
        password: accountData.password,
        phone: accountData.phoneNumber,
        deviceType: environment.production
          ? DeviceTypeIds.iOS
          : DeviceTypeIds.Web,
        client: {
          birthday: moment(accountData.birthday).format('YYYY-MM-DD'),
          height: accountData.height,
          gender: accountData.gender
        }
      })

      if (single.token) {
        authenticationToken.value = single.token
      }

      this.form.patchValue({ id: single.id })

      this.account = await this.accountProvider.getSingle(single.id)

      this.cookie.set(
        COOKIE_ROLE,
        CcrRolesMap(this.account.accountType.id),
        1,
        '/'
      )

      this.accountCreated = true

      if (!this.hasStoreUrl) {
        return
      }

      const spreeAccountResult = await this.spree.account.create({
        user: {
          email: accountData.email,
          password: accountData.password,
          password_confirmation: accountData.password
        }
      })

      if (spreeAccountResult.isFail()) {
        throw new Error(
          `Spree account creation error. Reason: ${
            spreeAccountResult.fail().message
          }`
        )
      }

      await this.accountIdentifier.add({
        account: this.account.id,
        organization: this.context.organizationId,
        name: SPREE_EXTERNAL_ID_NAME,
        value: spreeAccountResult.success().data.id
      })

      await this.loadSpreeInfo(accountData.email, accountData.password)

      const spreeCartResult = await this.spree.cart.create({
        bearerToken: this.spreeToken.access_token
      })

      if (spreeCartResult.isFail()) {
        throw new Error(
          `Spree cart creation error. Reason: ${spreeCartResult.fail().message}`
        )
      }

      const setEmailRes = await this.spree.checkout.orderUpdate(
        { bearerToken: this.spreeToken.access_token },
        { order: { email: accountData.email } }
      )

      if (setEmailRes.isFail()) {
        throw new Error(
          `Spree email set error. Reason: ${setEmailRes.fail().message}`
        )
      }
    } catch (error) {
      const addLogRequest: AddLogRequest = {
        app: 'ccr-staticProvider',
        logLevel: 'error',
        keywords: [
          {
            platform: window.navigator.userAgent,
            environment: environment.ccrApiEnv,
            deviceLocale: this.lang.get(),
            userAgent: window.navigator.userAgent
          }
        ],
        message: `[PATIENT ONBOARDING] ${error}`
      }

      this.notifier.error(error)
      await this.log.add(addLogRequest)
      throw new Error(error)
    } finally {
      this.bus.trigger('checkout.loading.show', false)
    }
  }

  private async loadSpreeInfo(email: string, password: string): Promise<void> {
    const spreeToken = await this.spree.authentication.getToken({
      username: email,
      password: password
    })

    if (spreeToken.isFail()) {
      throw new Error(
        `Spree token fetch error. Reason: ${spreeToken.fail().message}`
      )
    }

    this.spreeToken = spreeToken.success()

    this.spreeProvider.setBaseApiOptions(
      {
        baseUrl: this.storeUrl,
        headers: { Authorization: `Bearer ${this.spreeToken.access_token}` }
      },
      true
    )

    this.cookie.set(ECOMMERCE_ACCESS_TOKEN, this.spreeToken.access_token)
    this.cookie.set(ECOMMERCE_REFRESH_TOKEN, this.spreeToken.refresh_token)
  }

  private generateHeights(): void {
    this.heights = uniqBy(
      range(92, 216).map((value) => ({
        viewValue: this.convertCentimetersToFeetInches(value),
        value: value
      })),
      (v) => v.viewValue
    )
  }

  private regenerateAdditionalConsentForm(): void {
    this.additionalConsentForm = this.fb.array(
      this.additionalConsentButtons.map(
        () => new FormControl(false, Validators.requiredTrue)
      )
    )
  }

  private subscribeToFormEvents(): void {
    merge(this.form.valueChanges, this.additionalConsentForm.valueChanges)
      .pipe(untilDestroyed(this))
      .subscribe(() => {
        this.propagateTouched()
        this.propagateChange(
          this.form.valid && this.additionalConsentForm.valid
            ? this.form.value
            : null
        )
      })

    this.form
      .get('height')
      .valueChanges.pipe(
        filter((value) => value),
        untilDestroyed(this)
      )
      .subscribe((value) =>
        this.form
          .get('heightDisplayValue')
          .setValue(
            this.heights.find((height) => height.value === value)?.value
          )
      )
  }

  private async updateUserAccount(): Promise<void> {
    try {
      this.bus.trigger('checkout.loading.show', true)

      const accountData = this.form.value
      await this.accountProvider.update({
        id: this.account.id,
        firstName: accountData.firstName,
        lastName: accountData.lastName,
        phone: accountData.phoneNumber,
        client: {
          height: accountData.height,
          gender: accountData.gender
        }
      })
    } catch (error) {
    } finally {
      this.bus.trigger('checkout.loading.show', false)
    }
  }

  private validateFieldMatches(controlName: string): ValidatorFn {
    return (control: AbstractControl) => {
      return control.value === this.form?.get(controlName).value
        ? null
        : { wrongMatch: true }
    }
  }

  private validatePassword(
    control: AbstractControl
  ): Record<string, boolean> | null {
    const password = control.value

    owasp.config({ minLength: 8 })

    const result = owasp.test(password)

    const validationResult = {}

    if (result.failedTests.includes(0)) {
      validationResult['minLength'] = true
    }

    if (result.failedTests.includes(3)) {
      validationResult['lowercaseLetter'] = true
    }

    if (result.failedTests.includes(4)) {
      validationResult['uppercaseLetter'] = true
    }

    if (result.failedTests.includes(5)) {
      validationResult['oneNumber'] = true
    }

    if (result.failedTests.includes(6)) {
      validationResult['specialChar'] = true
    }

    if (result.failedTests.includes(2)) {
      validationResult['hasNoSequences'] = true
    }

    return Object.keys(validationResult).length > 0 ? validationResult : null
  }
}
