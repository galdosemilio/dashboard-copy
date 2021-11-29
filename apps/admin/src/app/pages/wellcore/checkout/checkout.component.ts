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
  AddLogRequest,
  AddressProvider,
  CcrRolesMap,
  DeviceTypeIds,
  Logging,
  Register
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
  public step = 0
  public checkoutData: CheckoutData = {}
  public useShippingAddress: boolean = true
  public whitelistedStates: string[] = STATES_LIST.filter(
    (state) => state.whitelisted
  ).map((state) => state.viewValue)

  private allProducts = []
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
    private router: Router
  ) {}

  public ngOnInit(): void {
    this.spree = makeClient({
      host: environment.wellcoreEcommerceHost
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

  public checkBillingInfoErrors(): boolean {
    return (
      this.stepper.selectedIndex === 2 &&
      (this.billingInfo.get('state').touched || this.useShippingAddress) &&
      this.billingInfo.get('state').invalid
    )
  }

  public getNextStepLabel(): string {
    switch (this.stepper.selectedIndex) {
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

    this.billingInfo.patchValue(patchValue)
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
        deviceType: DeviceTypeIds.Web,
        client: {
          birthday: moment(accountData.birthday).format('YYYY-MM-DD'),
          height: accountData.height,
          gender: accountData.gender
        }
      })

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

  private async startRedirection(): Promise<void> {
    window.location.href = `${environment.wellcoreUrl}?baseOrg=${environment.wellcoreOrgId}`
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

  private validateWhitelistedState(control: AbstractControl) {
    return STATES_LIST.find((state) => state.value === control.value)
      ?.whitelisted
      ? null
      : { invalidState: true }
  }
}
