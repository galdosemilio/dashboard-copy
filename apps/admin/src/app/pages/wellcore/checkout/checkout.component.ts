import { Component, OnInit, ViewChild } from '@angular/core'
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ValidatorFn,
  Validators
} from '@angular/forms'
import { Router } from '@angular/router'
import {
  CookieService,
  ECOMMERCE_ACCESS_TOKEN,
  ECOMMERCE_CART_ID,
  ECOMMERCE_REFRESH_TOKEN,
  EventsService,
  LanguageService,
  NotifierService
} from '@coachcare/common/services'
import { sleep } from '@coachcare/common/shared'
import { MatStepper } from '@coachcare/material'
import {
  AccountIdentifier,
  AccountProvider,
  AddLogRequest,
  DeviceTypeIds,
  Logging,
  Register
} from '@coachcare/sdk'
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy'
import { Client, makeClient } from '@spree/storefront-api-v2-sdk'
import { environment } from 'apps/admin/src/environments/environment'
import * as moment from 'moment'

const SPREE_EXTERNAL_ID_NAME = 'spree'

export interface CheckoutData {
  accountInfo?: {
    firstName: string
    lastName: string
    email: string
    emailConfirmation: string
    password: string
    passwordConfirmation: string
    phoneNumber: string
    gender: string
    height?: string
    birthday?: Date
  }
  paymentInfo?: {
    billingInfo: {
      firstName: string
      lastName: string
      address1: string
      address2?: string
      city: string
      state: string
      zip: string
    }
    creditCardInfo: {
      stripeToken: string
      last4: string
      exp_month: string
      exp_year: string
    }
  }
  shippingInfo?: {
    firstName: string
    lastName: string
    address1: string
    address2?: string
    city: string
    state: string
    zip: string
  }
}

@UntilDestroy()
@Component({
  selector: 'ccr-wellcore-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss']
})
export class WellcoreCheckoutComponent implements OnInit {
  @ViewChild('stepper', { static: true })
  stepper: MatStepper

  public accountId: string
  public accountInfo: FormGroup
  public accountCreated = false
  public shippingInfo: FormGroup
  public paymentInfo: FormGroup
  public orderReview: FormGroup
  public orderConfirm: FormGroup
  public step = 0
  public checkoutData: CheckoutData = {}
  public emailAddress: string
  public useShippingAddress: boolean = true

  private spree: Client

  constructor(
    private account: AccountProvider,
    private accountIdentifier: AccountIdentifier,
    private bus: EventsService,
    private cookie: CookieService,
    private fb: FormBuilder,
    private lang: LanguageService,
    private log: Logging,
    private notifier: NotifierService,
    private register: Register,
    private router: Router
  ) {}

  public ngOnInit(): void {
    this.spree = makeClient({
      host: 'http://localhost:4000'
    })

    this.createForm()
  }

  public checkAccountInfoErrors(): boolean {
    return (
      (this.accountInfo.get('gender').touched &&
        this.accountInfo.get('gender').invalid) ||
      (this.accountInfo.get('birthday').touched &&
        this.accountInfo.get('birthday').invalid)
    )
  }

  public async nextStep(): Promise<void> {
    const from = this.stepper.selectedIndex

    switch (from) {
      case 0:
        if (!this.accountCreated) {
          await this.createUserAccount()
        } else {
          await this.updateUserAccount()
        }
        break

      case 3:
        this.emailAddress = this.accountInfo.value.email
        void this.startRedirection()
        break
    }

    this.stepper.next()
    this.step = this.stepper.selectedIndex
  }

  public prevStep(): void {
    if (this.step > 0) {
      this.stepper.previous()
      this.step = this.stepper.selectedIndex
    } else {
      this.router.navigate(['/wellcore/cart'])
    }
  }

  public onChangeUseShippingAddress(value: boolean): void {
    this.useShippingAddress = value

    const patchValue = this.useShippingAddress
      ? this.shippingInfo.value
      : {
          firstName: '',
          lastName: '',
          address1: '',
          address2: '',
          city: '',
          state: '',
          zip: ''
        }

    this.paymentInfo.controls.billingInfo.patchValue(patchValue)
  }

  private createForm(): void {
    this.accountInfo = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      emailConfirmation: ['', [this.validateEmailMatches()]],
      password: ['', [Validators.required]],
      passwordConfirmation: ['', [this.validatePasswordMatches()]],
      phoneNumber: ['', Validators.required],
      gender: ['', [Validators.required, this.validateGender]],
      height: ['', Validators.required],
      birthday: ['', [Validators.required, this.validateAge]]
    })
    this.shippingInfo = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      address1: ['', Validators.required],
      address2: [''],
      city: ['', Validators.required],
      state: ['', Validators.required],
      zip: ['', Validators.required]
    })
    this.paymentInfo = this.fb.group({
      billingInfo: this.fb.group({
        firstName: ['', Validators.required],
        lastName: ['', Validators.required],
        address1: ['', Validators.required],
        address2: [''],
        city: ['', Validators.required],
        state: ['', Validators.required],
        zip: ['', Validators.required]
      }),
      creditCardInfo: this.fb.group({
        stripeToken: ['', Validators.required],
        last4: ['', Validators.required],
        exp_month: ['', Validators.required],
        exp_year: ['', Validators.required]
      })
    })
    this.orderReview = this.fb.group({})
    this.orderConfirm = this.fb.group({})

    this.accountInfo.valueChanges
      .pipe(untilDestroyed(this))
      .subscribe((control) => (this.checkoutData.accountInfo = control))

    this.paymentInfo.valueChanges
      .pipe(untilDestroyed(this))
      .subscribe((controls) => (this.checkoutData.paymentInfo = controls))

    this.shippingInfo.valueChanges
      .pipe(untilDestroyed(this))
      .subscribe((controls) => {
        this.checkoutData.shippingInfo = controls
        if (this.useShippingAddress) {
          this.paymentInfo.controls.billingInfo.patchValue(controls)
        }
      })
  }

  private async createUserAccount(): Promise<void> {
    try {
      this.bus.trigger('wellcore.loading.show', true)
      const accountData = this.accountInfo.value

      const single = await this.register.client({
        organization: environment.wellcoreOrgId,
        firstName: accountData.firstName,
        lastName: accountData.lastName,
        email: accountData.email,
        password: accountData.password,
        phone: accountData.phoneNumber,
        deviceType: DeviceTypeIds.Web,
        client: {
          birthday: moment(accountData.birthday).format('YYYY-MM-DD'),
          height: accountData.height,
          gender: accountData.gender
        }
      })

      this.accountId = single.id

      this.accountCreated = true

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

      const spreeToken = await this.spree.authentication.getToken({
        username: accountData.email,
        password: accountData.password
      })

      if (spreeToken.isFail()) {
        throw new Error(
          `Spree token fetch error. Reason: ${spreeToken.fail().message}`
        )
      }

      this.cookie.set(ECOMMERCE_ACCESS_TOKEN, spreeToken.success().access_token)
      this.cookie.set(
        ECOMMERCE_REFRESH_TOKEN,
        spreeToken.success().refresh_token
      )

      await this.accountIdentifier.add({
        account: single.id,
        organization: environment.wellcoreOrgId,
        name: SPREE_EXTERNAL_ID_NAME,
        value: accountData.email
      })

      const cart = await this.spree.cart.create({
        bearerToken: this.cookie.get(ECOMMERCE_ACCESS_TOKEN)
      })

      if (cart.isFail()) {
        throw new Error(
          `Spree cart creation error. Reason: ${cart.fail().message}`
        )
      }

      this.cookie.set(ECOMMERCE_CART_ID, cart.success().data.id)

      const products = await this.spree.products.list({
        bearerToken: this.cookie.get(ECOMMERCE_ACCESS_TOKEN)
      })

      if (products.isFail()) {
        throw new Error(
          `Spree product fetching error. Reason: ${products.fail().message}`
        )
      }

      const addItemResult = await this.spree.cart.addItem(
        {
          bearerToken: this.cookie.get(ECOMMERCE_ACCESS_TOKEN)
        },
        {
          variant_id: products.success().data.shift()?.id,
          quantity: 1
        }
      )

      if (addItemResult.isFail()) {
        throw new Error(
          `Spree item add error. Reason: ${addItemResult.fail().message}`
        )
      }
    } catch (error) {
      const addLogRequest: AddLogRequest = {
        app: 'ccr-staticProvider',
        logLevel: 'error',
        keywords: [
          {
            platform: window.navigator.appVersion,
            environment: environment.ccrApiEnv,
            deviceLocale: this.lang.get(),
            userAgent: window.navigator.userAgent
          }
        ],
        message: `[WELLCORE ONBOARDING] ${error}`
      }

      await this.log.add(addLogRequest)
      this.notifier.error(error)
      throw new Error(error)
    } finally {
      this.bus.trigger('wellcore.loading.show', false)
    }
  }

  private async startRedirection(): Promise<void> {
    await sleep(8000)
    window.location.href = `${environment.url}/${environment.wellcoreOrgId}`
  }

  private async updateUserAccount(): Promise<void> {
    try {
      this.bus.trigger('wellcore.loading.show', true)

      const accountData = this.accountInfo.value
      await this.account.update({
        id: this.accountId,
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
      this.bus.trigger('wellcore.loading.show', false)
    }
  }

  private validateAge(control: AbstractControl) {
    return control.value && moment().diff(moment(control.value), 'years') < 18
      ? { invalidAge: true }
      : null
  }

  private validateGender(control: AbstractControl) {
    return control.value === 'female' ? { invalidGender: true } : null
  }

  private validateEmailMatches(): ValidatorFn {
    return (control: AbstractControl) => {
      return control.value === this.checkoutData.accountInfo?.email
        ? null
        : { wrongMatch: true }
    }
  }

  private validatePasswordMatches(): ValidatorFn {
    return (control: AbstractControl) => {
      return control.value === this.checkoutData.accountInfo?.password
        ? null
        : { wrongMatch: true }
    }
  }
}
