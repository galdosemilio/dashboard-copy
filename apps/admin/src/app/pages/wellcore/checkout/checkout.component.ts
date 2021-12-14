import { Component, OnInit, ViewChild } from '@angular/core'
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ValidatorFn,
  Validators
} from '@angular/forms'
import { Router } from '@angular/router'
import { AddressLabelType } from '@coachcare/common/model'
import { authenticationToken } from '@coachcare/common/sdk.barrel'
import {
  CookieService,
  COOKIE_ROLE,
  ECOMMERCE_ACCESS_TOKEN,
  ECOMMERCE_REFRESH_TOKEN,
  EventsService,
  LanguageService,
  NotifierService
} from '@coachcare/common/services'
import { MatStepper } from '@coachcare/material'
import {
  AccountAddress,
  AccountIdentifier,
  AccountProvider,
  AccountSingle,
  AccountTypeIds,
  AddLogRequest,
  AddressProvider,
  CcrRolesMap,
  DeviceTypeIds,
  Logging,
  Register,
  Session
} from '@coachcare/sdk'
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy'
import { Client, makeClient } from '@spree/storefront-api-v2-sdk'
import { environment } from 'apps/admin/src/environments/environment'
import * as moment from 'moment'
import { STATES_LIST } from '../model'

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
    heightDisplayValue?: string
    birthday?: Date
  }
  billingInfo?: {
    firstName: string
    lastName: string
    address1: string
    address2?: string
    city: string
    state: string
    zip: string
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

type FirstStepMode = 'signup' | 'login'

@UntilDestroy()
@Component({
  selector: 'ccr-wellcore-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss']
})
export class WellcoreCheckoutComponent implements OnInit {
  @ViewChild('stepper', { static: true })
  stepper: MatStepper

  public account: AccountSingle
  public accountId: string
  public accountInfo: FormGroup
  public accountCreated = false
  public shippingInfo: FormGroup
  public billingInfo: FormGroup
  public orderReview: FormGroup
  public orderConfirm: FormGroup
  public loginInfo: FormGroup
  public firstStepMode: FirstStepMode = 'signup'
  public checkoutData: CheckoutData = {}
  public useShippingAddress: boolean = true
  public whitelistedStates: string[] = STATES_LIST.filter(
    (state) => state.whitelisted
  ).map((state) => state.viewValue)

  private billingAddress: AccountAddress
  private shippingAddress: AccountAddress
  private spree: Client

  constructor(
    private accountProvider: AccountProvider,
    private accountIdentifier: AccountIdentifier,
    private addressProvider: AddressProvider,
    private bus: EventsService,
    private cookie: CookieService,
    private fb: FormBuilder,
    private lang: LanguageService,
    private log: Logging,
    private notifier: NotifierService,
    private register: Register,
    private router: Router,
    private session: Session
  ) {
    this.validateAge = this.validateAge.bind(this)
    this.validateEmailMatches = this.validateEmailMatches.bind(this)
    this.validateGender = this.validateGender.bind(this)
    this.validatePasswordMatches = this.validatePasswordMatches.bind(this)
  }

  public ngOnInit(): void {
    this.spree = makeClient({
      host: environment.wellcoreEcommerceHost
    })

    this.createForm()
  }

  public checkAccountInfoErrors(): boolean {
    return (
      this.firstStepMode === 'signup' &&
      !this.accountCreated &&
      ((this.accountInfo.get('gender').touched &&
        this.accountInfo.get('gender').invalid) ||
        (this.accountInfo.get('birthday').touched &&
          this.accountInfo.get('birthday').invalid))
    )
  }

  public checkBillingInfoErrors(): boolean {
    return (
      this.stepper.selectedIndex === 2 &&
      (this.billingInfo.get('state').touched || this.useShippingAddress) &&
      this.billingInfo.get('state').invalid
    )
  }

  public getNextStepLabel(): string {
    switch (this.stepper.selectedIndex) {
      case 0:
        if (this.firstStepMode === 'login') {
          return 'Login'
        }
        return 'Next'
      case 3:
        return 'Complete Medical Intake Form'

      default:
        return 'Next'
    }
  }

  public async nextStep(): Promise<void> {
    const from = this.stepper.selectedIndex

    switch (from) {
      case 0:
        if (this.firstStepMode === 'login') {
          await this.loginAccount()
          return
        }

        if (this.accountInfo.invalid) {
          this.accountInfo.markAllAsTouched()
          return
        }

        if (!this.accountCreated) {
          await this.createUserAccount()
        } else {
          await this.updateUserAccount()
        }

        await this.resolveAccountAddresses()
        break

      case 1:
        if (this.shippingInfo.invalid) {
          this.shippingInfo.markAllAsTouched()
          return
        }

        if (!this.shippingAddress) {
          await this.createShippingAddress()
        } else {
          await this.updateShippingAddress()
        }
        break

      case 2:
        if (this.billingInfo.invalid) {
          this.billingInfo.markAllAsTouched()
          return
        }

        if (!this.billingAddress) {
          await this.createBillingAddress()
        } else {
          await this.updateBillingAddress()
        }
        break

      case 3:
        void this.startRedirection()
        break
    }

    this.stepper.next()
  }

  public prevStep(): void {
    if (this.stepper.selectedIndex === 0) {
      if (this.firstStepMode === 'signup') {
        void this.router.navigate(['/wellcore/cart'])
      } else {
        this.firstStepMode = 'signup'
      }
    } else {
      this.stepper.previous()
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

    this.billingInfo.patchValue(patchValue)
  }

  public changeFirstStepMode(mode: FirstStepMode): void {
    this.firstStepMode = mode
  }

  private async attemptLogout(): Promise<void> {
    try {
      await this.session.logout()
    } catch (error) {
      return
    }
  }

  private createForm(): void {
    this.accountInfo = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      emailConfirmation: ['', [this.validateEmailMatches()]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      passwordConfirmation: [
        '',
        [this.validatePasswordMatches(), Validators.minLength(8)]
      ],
      phoneNumber: ['', Validators.required],
      gender: ['', [Validators.required, this.validateGender]],
      height: ['', Validators.required],
      heightDisplayValue: [''],
      birthday: ['', [Validators.required, this.validateAge]],
      agreements: [false, [Validators.requiredTrue]]
    })
    this.loginInfo = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
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
    ;(this.billingInfo = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      address1: ['', Validators.required],
      address2: [''],
      city: ['', Validators.required],
      state: ['', [Validators.required, this.validateWhitelistedState]],
      zip: ['', Validators.required]
    })),
      (this.orderReview = this.fb.group({}))
    this.orderConfirm = this.fb.group({})

    this.accountInfo.valueChanges
      .pipe(untilDestroyed(this))
      .subscribe((control) => (this.checkoutData.accountInfo = control))

    this.billingInfo.valueChanges
      .pipe(untilDestroyed(this))
      .subscribe((controls) => (this.checkoutData.billingInfo = controls))

    this.shippingInfo.valueChanges
      .pipe(untilDestroyed(this))
      .subscribe((controls) => {
        this.checkoutData.shippingInfo = controls

        if (this.shippingInfo.invalid) {
          return
        }

        if (this.useShippingAddress) {
          this.billingInfo.patchValue(controls)
          this.billingInfo.updateValueAndValidity()

          if (this.billingInfo.valid) {
            return
          }

          this.billingInfo.reset()
          this.useShippingAddress = false
        }
      })
  }

  private async createBillingAddress(): Promise<void> {
    // Todo: need to integrate spree api for create address for billing when it's ready
    try {
      this.bus.trigger('wellcore.loading.show', true)
      const billingData = this.billingInfo.value

      await this.addressProvider.createAddress({
        account: this.account.id,
        name: `${billingData.firstName} ${billingData.lastName}`,
        address1: billingData.address1,
        address2: billingData.address2 || undefined,
        city: billingData.city,
        postalCode: billingData.zip,
        stateProvince: billingData.state,
        country: 'US',
        labels: ['1']
      })

      await this.resolveAccountAddresses()
    } catch (error) {
      this.notifier.error(error)
      throw new Error(error)
    } finally {
      this.bus.trigger('wellcore.loading.show', false)
    }
  }

  private async createShippingAddress(): Promise<void> {
    // Todo: need to integrate spree api for create address for shipping when it's ready
    try {
      this.bus.trigger('wellcore.loading.show', true)
      const shippingData = this.shippingInfo.value

      await this.addressProvider.createAddress({
        account: this.account.id,
        name: `${shippingData.firstName} ${shippingData.lastName}`,
        address1: shippingData.address1,
        address2: shippingData.address2 || undefined,
        city: shippingData.city,
        postalCode: shippingData.zip,
        stateProvince: shippingData.state,
        country: 'US',
        labels: ['2']
      })

      await this.resolveAccountAddresses()
    } catch (error) {
      this.notifier.error(error)
      throw new Error(error)
    } finally {
      this.bus.trigger('wellcore.loading.show', false)
    }
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

      this.account = await this.accountProvider.getSingle(single.id)

      this.cookie.set(
        COOKIE_ROLE,
        CcrRolesMap(this.account.accountType.id),
        1,
        '/'
      )

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

      await this.loadSpreeInfo(accountData.email, accountData.password)
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

  private getPartialAddressEcommerceAddress(
    addresses: AccountAddress[],
    type: AddressLabelType
  ): AccountAddress {
    return addresses.find((address) =>
      address.labels.some((label) => label.id.toString() === type)
    )
  }

  private async loginAccount(): Promise<void> {
    try {
      this.bus.trigger('wellcore.loading.show', true)
      const loginInfo = this.loginInfo.value

      await this.attemptLogout()

      await this.session.login({
        email: loginInfo.email,
        password: loginInfo.password,
        deviceType: DeviceTypeIds.Web,
        allowedAccountTypes: [AccountTypeIds.Client],
        organization: environment.wellcoreOrgId
      })

      await this.resolveOnboardingProgress()
      this.firstStepMode = 'signup'
    } catch (error) {
      this.notifier.error(error)

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
      throw new Error(error)
    } finally {
      this.bus.trigger('wellcore.loading.show', false)
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

    this.cookie.set(ECOMMERCE_ACCESS_TOKEN, spreeToken.success().access_token)
    this.cookie.set(ECOMMERCE_REFRESH_TOKEN, spreeToken.success().refresh_token)

    await this.accountIdentifier.add({
      account: this.accountId,
      organization: environment.wellcoreOrgId,
      name: SPREE_EXTERNAL_ID_NAME,
      value: email
    })
  }

  private loadBillingAddressIntoForm(address: AccountAddress): void {
    this.billingInfo.patchValue({
      firstName: address.name.split(' ')[0],
      lastName: address.name.split(' ')[1] || '',
      address1: address.address1,
      address2: address.address2 || '',
      state: address.stateProvince,
      country: address.country,
      zip: address.postalCode
    })
  }

  private loadShippingAddressIntoForm(address: AccountAddress): void {
    this.shippingInfo.patchValue({
      firstName: address.name.split(' ')[0],
      lastName: address.name.split(' ')[1] || '',
      address1: address.address1,
      address2: address.address2 || '',
      state: address.stateProvince,
      country: address.country,
      zip: address.postalCode
    })
  }

  private async resolveAccountAddresses(): Promise<void> {
    try {
      this.bus.trigger('wellcore.loading.show', true)

      const response = await this.addressProvider.getAddressList({
        account: this.account.id,
        limit: 'all'
      })

      const shippingAddress = response.data.find((addressEntry) =>
        addressEntry.labels.some((label) => label.name === 'shipping')
      )

      const billingAddress = response.data.find((addressEntry) =>
        addressEntry.labels.some((label) => label.name === 'billing')
      )

      if (shippingAddress) {
        this.shippingAddress = shippingAddress
        this.loadShippingAddressIntoForm(shippingAddress)
      } else {
        this.shippingInfo.patchValue({
          firstName: this.account.firstName,
          lastName: this.account.lastName
        })
      }

      if (billingAddress) {
        this.billingAddress = billingAddress
        this.loadBillingAddressIntoForm(billingAddress)
      } else {
        this.billingInfo.patchValue({
          firstName: this.account.firstName,
          lastName: this.account.lastName
        })
      }
    } catch (error) {
      this.notifier.error(error)
    } finally {
      this.bus.trigger('wellcore.loading.show', false)
    }
  }

  private async resolveOnboardingProgress(): Promise<void> {
    try {
      const loginInfo = this.loginInfo.value

      this.bus.trigger('wellcore.loading.show', true)

      const session = await this.session.check()

      // There's not even an active session
      if (!session?.id) {
        return
      }

      const account = await this.accountProvider.getSingle(session.id)

      // This should never happen, but just in case
      if (!account) {
        throw new Error('No account could be fetched with the current session')
      }

      this.account = account
      this.accountId = account.id

      await this.loadSpreeInfo(loginInfo.email, loginInfo.password)

      this.accountCreated = true

      this.accountInfo.patchValue({
        ...account,
        emailConfirmation: account.email,
        password: '123Abc..',
        passwordConfirmation: '123Abc..',
        phoneNumber: account.phone,
        gender: account.profile.gender,
        height: account.profile.height,
        birthday: account.profile.birthday,
        agreements: true
      })

      this.stepper.next()

      const addresses = await this.addressProvider.getAddressList({
        account: account.id,
        limit: 'all'
      })

      const shippingAddress = this.getPartialAddressEcommerceAddress(
        addresses.data,
        AddressLabelType.SHIPPING
      )

      if (!shippingAddress) {
        this.shippingInfo.patchValue({
          firstName: account.firstName,
          lastName: account.lastName
        })
        return
      }

      const [shipFirstName, shipLastName = ''] = shippingAddress.name.split(' ')

      this.shippingInfo.patchValue({
        ...shippingAddress,
        country: shippingAddress.country.id,
        firstName: shipFirstName,
        lastName: shipLastName || '',
        state: shippingAddress.stateProvince,
        zip: shippingAddress.postalCode
      })

      this.stepper.next()

      const billingAddress = this.getPartialAddressEcommerceAddress(
        addresses.data,
        AddressLabelType.BILLING
      )

      if (!billingAddress) {
        return
      }

      const [billFirstName, billLastName = ''] = billingAddress.name.split(' ')

      this.billingInfo.patchValue({
        ...billingAddress,
        country: billingAddress.country.id,
        firstName: billFirstName,
        lastName: billLastName,
        state: billingAddress.stateProvince,
        zip: billingAddress.postalCode
      })

      this.stepper.next()
    } catch (error) {
      throw new Error(error)
    } finally {
      this.bus.trigger('wellcore.loading.show', false)
    }
  }

  private async startRedirection(): Promise<void> {
    window.location.href = `${environment.wellcoreUrl}/provider/dashboard?baseOrg=${environment.wellcoreOrgId}`
  }

  private async updateBillingAddress(): Promise<void> {
    // Todo: need to integrate spree api for update address for billing when it's ready
    try {
      this.bus.trigger('wellcore.loading.show', true)

      const billingData = this.billingInfo.value

      await this.addressProvider.updateAddress({
        id: this.billingAddress.id.toString(),
        account: this.account.id,
        name: `${billingData.firstName} ${billingData.lastName}`,
        address1: billingData.address1,
        address2: billingData.address2 || null,
        stateProvince: billingData.state,
        postalCode: billingData.zip
      })

      await this.resolveAccountAddresses()
    } catch (error) {
      this.notifier.error(error)
      throw new Error(error)
    } finally {
      this.bus.trigger('wellcore.loading.show', false)
    }
  }

  private async updateShippingAddress(): Promise<void> {
    // Todo: need to integrate spree api for create address for billing when it's ready
    try {
      this.bus.trigger('wellcore.loading.show', true)

      const shippingData = this.shippingInfo.value

      await this.addressProvider.updateAddress({
        id: this.shippingAddress.id.toString(),
        account: this.account.id,
        name: `${shippingData.firstName} ${shippingData.lastName}`,
        address1: shippingData.address1,
        address2: shippingData.address2 || null,
        stateProvince: shippingData.state,
        postalCode: shippingData.zip
      })

      await this.resolveAccountAddresses()
    } catch (error) {
      this.notifier.error(error)
      throw new Error(error)
    } finally {
      this.bus.trigger('wellcore.loading.show', false)
    }
  }

  private async updateUserAccount(): Promise<void> {
    try {
      this.bus.trigger('wellcore.loading.show', true)

      const accountData = this.accountInfo.value
      await this.accountProvider.update({
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
    return !this.accountCreated &&
      control.value &&
      moment().diff(moment(control.value), 'years') < 18
      ? { invalidAge: true }
      : null
  }

  private validateGender(control: AbstractControl) {
    return !this.accountCreated && control.value === 'female'
      ? { invalidGender: true }
      : null
  }

  private validateEmailMatches(): ValidatorFn {
    return (control: AbstractControl) => {
      return this.accountCreated ||
        control.value === this.checkoutData.accountInfo?.email
        ? null
        : { wrongMatch: true }
    }
  }

  private validatePasswordMatches(): ValidatorFn {
    return (control: AbstractControl) => {
      return this.accountCreated ||
        control.value === this.checkoutData.accountInfo?.password
        ? null
        : { wrongMatch: true }
    }
  }

  private validateWhitelistedState(control: AbstractControl) {
    return STATES_LIST.find((state) => state.value === control.value)
      ?.whitelisted
      ? null
      : { invalidState: true }
  }
}
