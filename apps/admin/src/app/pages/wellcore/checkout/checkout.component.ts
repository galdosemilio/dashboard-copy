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
  AccountAddress,
  AccountIdentifier,
  AccountProvider,
  AccountSingle,
  AddLogRequest,
  AddressProvider,
  DeviceTypeIds,
  Logging,
  Register
} from '@coachcare/sdk'
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy'
import { Client, makeClient } from '@spree/storefront-api-v2-sdk'
import { OrderAttr } from '@spree/storefront-api-v2-sdk/types/interfaces/Order'
import { ProductAttr } from '@spree/storefront-api-v2-sdk/types/interfaces/Product'
import { RelationType } from '@spree/storefront-api-v2-sdk/types/interfaces/Relationships'
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

  public account: AccountSingle
  public accountId: string
  public accountInfo: FormGroup
  public accountCreated = false
  public cartInfo: OrderAttr
  public cartItems: ProductAttr[] = []
  public shippingInfo: FormGroup
  public paymentInfo: FormGroup
  public orderReview: FormGroup
  public orderConfirm: FormGroup
  public step = 0
  public checkoutData: CheckoutData = {}
  public emailAddress: string
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
    const billingAddressGroup = this.paymentInfo.get('billingInfo')
    return (
      this.stepper.selectedIndex === 2 &&
      (billingAddressGroup.get('state').touched || this.useShippingAddress) &&
      billingAddressGroup.get('state').invalid
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

        await this.resolveAccountAddresses()
        break

      case 1:
        if (!this.shippingAddress) {
          await this.createShippingAddress()
        } else {
          await this.updateShippingAddress()
        }

        await this.updateShippingAddressOnSpree()
        break

      case 2:
        if (!this.billingAddress) {
          await this.createBillingAddress()
        } else {
          await this.updateBillingAddress()
        }

        await this.updatePaymentMethodOnSpree()
        await this.updateBillingAddressOnSpree()
        await this.resolveCartItems()
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
        state: ['', [Validators.required, this.validateWhitelistedState]],
        zip: ['', Validators.required]
      }),
      creditCardInfo: this.fb.group({
        type: ['', Validators.required],
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

  private async createBillingAddress(): Promise<void> {
    try {
      this.bus.trigger('wellcore.loading.show', true)
      const billingData = this.paymentInfo.get('billingInfo').value

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

  private async updateBillingAddressOnSpree(): Promise<void> {
    try {
      this.bus.trigger('wellcore.loading.show', true)
      const billingData = this.paymentInfo.get('billingInfo').value

      const orderUpdateRes = await this.spree.checkout.orderUpdate(
        { bearerToken: this.cookie.get(ECOMMERCE_ACCESS_TOKEN) },
        {
          order: {
            bill_address_attributes: {
              firstname: billingData.firstName,
              lastname: billingData.lastName,
              address1: billingData.address1,
              address2: billingData.address2 || '',
              city: billingData.city,
              phone: this.account.phone,
              zipcode: billingData.zip,
              state_name: STATES_LIST.find(
                (state) => state.value === billingData.state
              )?.viewValue,
              country_iso: 'US'
            }
          }
        }
      )

      if (orderUpdateRes.isFail()) {
        throw new Error(
          `[WELLCORE] Order address could not be updated. Reason: ${
            orderUpdateRes.fail().message
          }`
        )
      }
    } catch (error) {
      this.notifier.error(error)
      throw new Error(error)
    } finally {
      this.bus.trigger('wellcore.loading.show', false)
    }
  }

  private async updateShippingAddressOnSpree(): Promise<void> {
    try {
      this.bus.trigger('wellcore.loading.show', true)
      const shippingData = this.shippingInfo.value

      const orderUpdateRes = await this.spree.checkout.orderUpdate(
        { bearerToken: this.cookie.get(ECOMMERCE_ACCESS_TOKEN) },
        {
          order: {
            ship_address_attributes: {
              firstname: shippingData.firstName,
              lastname: shippingData.lastName,
              address1: shippingData.address1,
              address2: shippingData.address2 || '',
              city: shippingData.city,
              phone: this.account.phone,
              zipcode: shippingData.zip,
              state_name: STATES_LIST.find(
                (state) => state.value === shippingData.state
              )?.viewValue,
              country_iso: 'US'
            }
          }
        }
      )

      if (orderUpdateRes.isFail()) {
        throw new Error(
          `[WELLCORE] Order address could not be updated. Reason: ${
            orderUpdateRes.fail().message
          }`
        )
      }
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

      this.allProducts = products.success().data.slice()

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

  private loadBillingAddressIntoForm(address: AccountAddress): void {
    this.paymentInfo.get('billingInfo').patchValue({
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
        this.paymentInfo.get('billingInfo').patchValue({
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

  private async resolveCartItems(): Promise<void> {
    try {
      const cartShowResult = await this.spree.cart.show({
        bearerToken: this.cookie.get(ECOMMERCE_ACCESS_TOKEN)
      })

      if (cartShowResult.isFail()) {
        throw new Error(
          `[WELLCORE] Cannot fetch cart items. Reason ${
            cartShowResult.fail().message
          }`
        )
      }

      this.cartInfo = cartShowResult.success().data

      this.cartItems = (cartShowResult.success().data.relationships.variants
        .data as RelationType[])
        .map(
          (variant) =>
            this.allProducts.find((product) => product.id === variant.id) ??
            null
        )
        .filter((item) => item)
    } catch (error) {
      this.notifier.error(error)
    }
  }

  private async startRedirection(): Promise<void> {
    await sleep(8000)
    window.location.href = `${environment.url}/${environment.wellcoreOrgId}`
  }

  private async updateBillingAddress(): Promise<void> {
    try {
      this.bus.trigger('wellcore.loading.show', true)

      const billingData = this.paymentInfo.get('billingInfo').value

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

  private async updatePaymentMethodOnSpree(): Promise<void> {
    try {
      this.bus.trigger('wellcore.loading.show', true)

      const paymentInfo = this.paymentInfo.value.creditCardInfo

      const paymentMethods = await this.spree.checkout.paymentMethods({
        bearerToken: this.cookie.get(ECOMMERCE_ACCESS_TOKEN)
      })

      if (
        paymentMethods.isFail() ||
        paymentMethods.success().data.length <= 0
      ) {
        throw new Error(
          `[WELLCORE] Can't fetch payment methods. Reason: ${
            paymentMethods.fail().message
          }`
        )
      }

      // const paymentResult = await this.spree.checkout.addPayment(
      //   { bearerToken: this.cookie.get(ECOMMERCE_ACCESS_TOKEN) },
      //   {
      //     payment_method_id: paymentMethods.success().data.shift().id,
      //     gateway_payment_profile_id: paymentInfo.stripeToken,
      //     cc_type: paymentInfo.type,
      //     last_digits: paymentInfo.last4,
      //     month: paymentInfo.exp_month,
      //     year: paymentInfo.exp_year
      //   }
      // )
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
