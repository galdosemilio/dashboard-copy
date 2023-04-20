import { CdkStep, StepperSelectionEvent } from '@angular/cdk/stepper'
import {
  ChangeDetectorRef,
  Component,
  OnInit,
  ViewChild,
  ViewEncapsulation
} from '@angular/core'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { ActivatedRoute } from '@angular/router'
import { AddressLabelType, EcommerceProduct } from '@coachcare/common/model'
import {
  ContextService,
  CookieService,
  ECOMMERCE_ACCESS_TOKEN,
  ECOMMERCE_REFRESH_TOKEN,
  EventsService,
  LanguageService,
  NotifierService
} from '@coachcare/common/services'
import { sleep, _ } from '@coachcare/common/shared'
import { AppStoreFacade } from '@coachcare/common/store'
import { MatStepper } from '@coachcare/material'
import {
  AccountAddress,
  AccountProvider,
  AccountSingle,
  AccountTypeIds,
  AddLogRequest,
  AddressProvider,
  DeviceTypeIds,
  Logging,
  Session,
  SpreeProvider
} from '@coachcare/sdk'
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy'
import { Client, makeClient } from '@spree/storefront-api-v2-sdk'
import { OrderAttr } from '@spree/storefront-api-v2-sdk/types/interfaces/Order'
import { IOAuthToken } from '@spree/storefront-api-v2-sdk/types/interfaces/Token'
import { environment } from 'apps/admin/src/environments/environment'
import { get } from 'lodash'
import * as moment from 'moment'
import { resolveConfig } from '../config/section.config'
import {
  CheckoutAccountComponent,
  CheckoutAccountInfo,
  AdditionalConsentButtonEntry
} from './account-info'
import {
  CheckoutBillingInfo,
  CheckoutBillingInfoComponent
} from './billing-info'
import {
  CheckoutShippingInfo,
  CheckoutShippingInfoComponent
} from './shipping-info'

export interface CheckoutData {
  accountInfo?: CheckoutAccountInfo
  billingInfo?: CheckoutBillingInfo
  shippingInfo?: CheckoutShippingInfo
}

interface MALACustomData {
  links: {
    additionalConsent: Record<
      string,
      string | AdditionalConsentButtonEntry['links']
    >[]
  }
}

type FirstStepMode = 'signup' | 'login'

type StepName =
  | 'account_create'
  | 'shipping_info'
  | 'billing_info'
  | 'payment'
  | 'product_selection'
  | 'order_review'
  | 'order_confirm'

type StepState = 'required' | 'hidden'

type ActionButtonType = 'dashboard' | 'storefront'

@UntilDestroy()
@Component({
  selector: 'ccr-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class CheckoutComponent implements OnInit {
  @ViewChild(CheckoutAccountComponent)
  accountComponent: CheckoutAccountComponent

  @ViewChild(CheckoutBillingInfoComponent)
  billingInfoComponent: CheckoutBillingInfoComponent

  @ViewChild(CheckoutShippingInfoComponent)
  shippingInfoComponent: CheckoutShippingInfoComponent

  @ViewChild('stepper', { static: true })
  stepper: MatStepper

  public account: AccountSingle
  public accountCreated = false
  public additionalConsentButtons: AdditionalConsentButtonEntry[] = []
  public checkoutData: CheckoutData = {}
  public checkoutForm: FormGroup
  public firstStepMode: FirstStepMode = 'signup'
  public hasStoreUrl: boolean
  public hiddenSteps: StepName[] = []
  public loginInfo: FormGroup
  public logoUrl: string
  public nextStepLabel = _('CHECKOUT.CREATE_ACCOUNT')
  public orderDetails: OrderAttr
  public refreshToken: string
  public requestCount = 0
  public selectedProducts: EcommerceProduct[] = []
  public shippingAddress: AccountAddress
  public showBackButton = false
  public showNextButton = true
  public showSpinner = false
  public storeUrl: string
  public spree: Client
  public spreeToken: IOAuthToken
  public useShippingAddress: boolean = true
  public actionButtonType: ActionButtonType = 'dashboard'
  private automaticShopifyRedirect = false

  constructor(
    private accountProvider: AccountProvider,
    private addressProvider: AddressProvider,
    private bus: EventsService,
    private cdr: ChangeDetectorRef,
    private context: ContextService,
    private cookie: CookieService,
    private fb: FormBuilder,
    private lang: LanguageService,
    private log: Logging,
    private notifier: NotifierService,
    private org: AppStoreFacade,
    private route: ActivatedRoute,
    private session: Session,
    private spreeProvider: SpreeProvider
  ) {}

  public ngOnInit(): void {
    this.createForm()
    this.subscribeToRouteEvents()
    this.subscribeToPrefs()
    this.subscribeToBusEvents()
    this.resolveAutomaticShopifyRedirect()
  }

  public changeFirstStepMode(mode: FirstStepMode): void {
    this.firstStepMode = mode
  }

  public refreshNextStepLabel(nextStep?: CdkStep): void {
    const stepName: StepName = get(
      nextStep ?? this.stepper.selected,
      'content.elementRef.nativeElement.parentElement.dataset.name'
    )

    switch (stepName) {
      case 'account_create':
        if (this.firstStepMode === 'login') {
          this.nextStepLabel = _('ADMIN.ORGS.SETTINGS.MFA_LOGIN')
        } else {
          this.nextStepLabel = _('CHECKOUT.CREATE_ACCOUNT')
        }
        break
      case 'product_selection':
        this.nextStepLabel = _('CHECKOUT.REVIEW_ORDER')
        break
      case 'order_review':
        this.nextStepLabel = _('CHECKOUT.COMPLETE_ORDER')
        break
      case 'order_confirm':
        this.nextStepLabel =
          this.actionButtonType === 'dashboard'
            ? _('CHECKOUT.GO_TO_PATIENT_DASHBOARD')
            : _('CHECKOUT.GO_TO_STORE')
        break
      default:
        this.nextStepLabel = _('GLOBAL.NEXT')
        break
    }

    this.cdr.detectChanges()
  }

  public async nextStep(): Promise<void> {
    const stepName: StepName = get(
      this.stepper.selected,
      'content.elementRef.nativeElement.parentElement.dataset.name'
    )

    switch (stepName) {
      case 'account_create':
        if (this.firstStepMode === 'login') {
          await this.loginAccount()
          return
        }

        if (this.checkoutForm.get('account').invalid) {
          this.accountComponent.markAllAsTouched()
          this.checkoutForm.get('account').markAllAsTouched()
          return
        }

        await this.accountComponent.submit()

        if (this.hasStoreUrl) {
          await this.loadSpreeInfo(
            this.checkoutData.accountInfo.email,
            this.checkoutData.accountInfo.password
          )
        }

        await this.resolveAccountAddresses()
        break

      case 'shipping_info':
        if (this.checkoutForm.get('shipping').invalid) {
          this.checkoutForm.get('shipping').markAllAsTouched()
          this.shippingInfoComponent.markAllAsTouched()
          return
        }

        await this.shippingInfoComponent.submit()
        await this.resolveAccountAddresses()

        this.onChangeUseShippingAddress(true)
        break

      case 'billing_info':
        if (this.checkoutForm.get('billing').invalid) {
          this.checkoutForm.get('billing').markAllAsTouched()
          this.billingInfoComponent.markAllAsTouched()
          return
        }

        await this.billingInfoComponent.submit()
        await this.resolveAccountAddresses()
        break

      case 'product_selection':
        await this.addItemsToCart()
        await this.refreshOrderDetails()
        break

      case 'order_review':
        await this.processCheckout()
        break

      case 'order_confirm':
        void this.startRedirection()
        break
    }

    this.stepper.next()
  }

  public prevStep(): void {
    if (this.stepper.selectedIndex === 0) {
      this.firstStepMode = 'signup'
    } else {
      this.stepper.previous()
    }
  }

  public onChangeUseShippingAddress(value: boolean): void {
    this.useShippingAddress = value

    const patchValue = this.useShippingAddress
      ? this.checkoutForm.get('shipping').value
      : {
          firstName: '',
          lastName: '',
          address1: '',
          address2: '',
          city: '',
          state: this.checkoutForm.get('shipping').value.state ?? '',
          zip: ''
        }

    this.checkoutForm.get('billing').patchValue(patchValue)
  }

  public async onStepChange($event: StepperSelectionEvent): Promise<void> {
    const stepName: StepName = get(
      $event.selectedStep,
      'content.elementRef.nativeElement.parentElement.dataset.name'
    )

    this.showNextButton = true

    switch (stepName) {
      case 'account_create':
        this.showBackButton = false
        break

      case 'order_confirm':
        this.showBackButton = false
        this.showNextButton = !this.automaticShopifyRedirect
        break

      case 'shipping_info':
      case 'billing_info':
      case 'product_selection':
      case 'order_review':
        this.showBackButton = true
        break
    }

    this.refreshNextStepLabel($event.selectedStep)

    if (!this.showNextButton) {
      await sleep(2000)
      void this.startRedirection()
    }
  }

  private async addItemsToCart(): Promise<void> {
    try {
      if (!this.hasStoreUrl) {
        return
      }

      this.bus.trigger('checkout.loading.show', true)
      await this.spree.cart.emptyCart({
        bearerToken: this.spreeToken.access_token
      })

      const selectedProducts = this.checkoutForm.value.products

      for (const product of selectedProducts) {
        const spreeItemAddResult = await this.spree.cart.addItem(
          { bearerToken: this.spreeToken.access_token },
          {
            variant_id: product,
            quantity: 1
          }
        )

        if (spreeItemAddResult.isFail()) {
          throw new Error(
            `Spree item adding error. Reason: ${
              spreeItemAddResult.fail().message
            }`
          )
        }
      }
    } catch (error) {
      this.notifier.error(error)
    } finally {
      this.bus.trigger('checkout.loading.show', false)
    }
  }

  private async attemptLogout(): Promise<void> {
    try {
      await this.session.logout()
    } catch (error) {
      return
    }
  }

  private createForm(): void {
    this.checkoutForm = this.fb.group({
      account: [null, Validators.required],
      billing: [null, Validators.required],
      products: [[]],
      shipping: [null, Validators.required]
    })
    this.loginInfo = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    })

    this.checkoutForm
      .get('account')
      .valueChanges.pipe(untilDestroyed(this))
      .subscribe((control) => (this.checkoutData.accountInfo = control))

    this.checkoutForm
      .get('billing')
      .valueChanges.pipe(untilDestroyed(this))
      .subscribe((controls) => (this.checkoutData.billingInfo = controls))

    this.checkoutForm
      .get('shipping')
      .valueChanges.pipe(untilDestroyed(this))
      .subscribe((controls) => {
        this.checkoutData.shippingInfo = controls

        if (this.checkoutForm.get('shipping').invalid) {
          return
        }

        if (this.useShippingAddress) {
          this.checkoutForm.get('billing').patchValue(controls)
          this.checkoutForm.get('billing').updateValueAndValidity()

          if (this.checkoutForm.get('billing').valid) {
            return
          }

          this.checkoutForm.get('billing').reset()
          this.useShippingAddress = false
        }
      })
  }

  private getPartialEcommerceAddress(
    addresses: AccountAddress[],
    type: AddressLabelType
  ): AccountAddress {
    return addresses.find((address) =>
      address.labels.some((label) => label.id.toString() === type)
    )
  }

  private async loginAccount(): Promise<void> {
    try {
      this.bus.trigger('checkout.loading.show', true)
      const loginInfo = this.loginInfo.value

      await this.attemptLogout()

      await this.session.login({
        email: loginInfo.email,
        password: loginInfo.password,
        deviceType: DeviceTypeIds.Web,
        allowedAccountTypes: [AccountTypeIds.Client],
        organization: this.context.organizationId
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
            platform: window.navigator.userAgent,
            environment: environment.ccrApiEnv,
            deviceLocale: this.lang.get(),
            userAgent: window.navigator.userAgent
          }
        ],
        message: `[PATIENT ONBOARDING] ${error}`
      }

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

  private loadBillingAddressIntoForm(address: AccountAddress): void {
    this.checkoutForm.get('billing').patchValue({
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
    this.checkoutForm.get('shipping').patchValue({
      firstName: address.name.split(' ')[0],
      lastName: address.name.split(' ')[1] || '',
      address1: address.address1,
      address2: address.address2 || '',
      state: address.stateProvince,
      country: address.country,
      zip: address.postalCode
    })
  }

  private async processCheckout(): Promise<void> {
    try {
      if (!this.hasStoreUrl) {
        return
      }

      this.bus.trigger('checkout.loading.show', true)

      const paymentMethodsResponse = await this.spree.checkout.paymentMethods({
        bearerToken: this.spreeToken.access_token
      })

      if (paymentMethodsResponse.isFail()) {
        throw new Error(
          `Spree payment method fetching error. Please, contact the administrator and show them this error message: ${
            paymentMethodsResponse.fail().message
          }`
        )
      }

      if (paymentMethodsResponse.success().data.length <= 0) {
        throw new Error(
          'Spree payment method list is empty. Please, contact the administrator and show them this error message.'
        )
      }

      const addPaymentRes = await this.spree.checkout.addPayment(
        { bearerToken: this.spreeToken.access_token },
        {
          payment_method_id: paymentMethodsResponse.success().data[0].id,
          source_attributes: {
            gateway_payment_profile_id:
              this.checkoutData.billingInfo.cardInfo.token,
            cc_type: this.checkoutData.billingInfo.cardInfo.type,
            last_digits: this.checkoutData.billingInfo.cardInfo.last4,
            month: this.checkoutData.billingInfo.cardInfo.expMonth.toString(),
            year: this.checkoutData.billingInfo.cardInfo.expYear.toString(),
            name: `${this.checkoutData.accountInfo.firstName} ${this.checkoutData.accountInfo.lastName}`
          }
        }
      )

      if (addPaymentRes.isFail()) {
        throw new Error(
          `Spree payment cannot be added. Reason ${
            addPaymentRes.fail().message
          }`
        )
      }

      await this.billingInfoComponent.onChange({ complete: true })

      this.checkoutForm.get('billing').updateValueAndValidity()

      if (!this.hiddenSteps.includes('payment')) {
        await this.spreeProvider.createCreditCard({
          credit_card: { token: this.checkoutData.billingInfo.cardInfo.token }
        })
      }

      const completeCheckoutRes = await this.spree.checkout.complete({
        bearerToken: this.spreeToken.access_token
      })

      if (completeCheckoutRes.isFail()) {
        throw new Error(
          `Spree order cannot be completed. Reason ${
            completeCheckoutRes.fail().message
          }`
        )
      }
    } catch (error) {
      this.notifier.error(error)
      throw new Error(error)
    } finally {
      this.bus.trigger('checkout.loading.show', false)
    }
  }

  private async resolveAccountAddresses(): Promise<void> {
    try {
      this.bus.trigger('checkout.loading.show', true)

      const accountInfo = this.checkoutData.accountInfo

      const response = await this.addressProvider.getAddressList({
        account: accountInfo.id,
        limit: 'all'
      })

      const shippingAddress = response.data.find((addressEntry) =>
        addressEntry.labels.some(
          (label) => label.id === AddressLabelType.SHIPPING
        )
      )

      const billingAddress = response.data.find((addressEntry) =>
        addressEntry.labels.some(
          (label) => label.id === AddressLabelType.BILLING
        )
      )

      if (shippingAddress) {
        this.shippingAddress = shippingAddress
        this.loadShippingAddressIntoForm(shippingAddress)
      } else {
        this.checkoutForm.get('shipping').patchValue({
          firstName: accountInfo.firstName,
          lastName: accountInfo.lastName
        })
      }

      if (billingAddress) {
        this.loadBillingAddressIntoForm(billingAddress)
      } else {
        this.checkoutForm.get('billing').patchValue({
          firstName: accountInfo.firstName,
          lastName: accountInfo.lastName
        })
      }
    } catch (error) {
      this.notifier.error(error)
    } finally {
      this.bus.trigger('checkout.loading.show', false)
    }
  }

  private async refreshOrderDetails(): Promise<void> {
    try {
      if (!this.hasStoreUrl) {
        return
      }

      const orderRes = await this.spree.checkout.orderUpdate(
        { bearerToken: this.spreeToken.access_token },
        {}
      )

      if (orderRes.isFail()) {
        throw new Error(
          `Spree Error. Order Details can't be resolved. Reason: ${
            orderRes.fail().message
          }`
        )
      }

      this.orderDetails = orderRes.success().data

      const productsRes = await this.spree.products.list(
        {
          bearerToken: this.spreeToken.access_token
        },
        { include: 'images' }
      )

      if (productsRes.isFail()) {
        throw new Error(productsRes.fail().message)
      }

      const included = productsRes.success().included
      const selectedIds: string[] = this.checkoutForm.value.products

      this.selectedProducts = productsRes
        .success()
        .data.map((entry) => new EcommerceProduct(entry, included))
        .filter((product) => selectedIds.includes(product.id))
    } catch (error) {
      this.notifier.error(error)
    }
  }

  private async resolveOnboardingProgress(): Promise<void> {
    try {
      const loginInfo = this.loginInfo.value

      this.bus.trigger('checkout.loading.show', true)

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

      if (this.hasStoreUrl) {
        await this.loadSpreeInfo(loginInfo.email, loginInfo.password)
      }

      this.accountCreated = true

      this.checkoutForm.get('account').patchValue({
        ...account,
        emailConfirmation: account.email,
        password: '123Abc..',
        passwordConfirmation: '123Abc..',
        phoneNumber: account.phone,
        gender: account.profile.gender,
        height: account.profile.height,
        birthday: moment(account.profile.birthday),
        agreements: true
      })

      this.stepper.next()

      const addresses = await this.addressProvider.getAddressList({
        account: account.id,
        limit: 'all'
      })

      const shippingAddress = this.getPartialEcommerceAddress(
        addresses.data,
        AddressLabelType.SHIPPING
      )

      if (!shippingAddress) {
        this.checkoutForm.get('shipping').patchValue({
          firstName: account.firstName,
          lastName: account.lastName
        })
        return
      }

      const [shipFirstName, shipLastName = ''] = shippingAddress.name.split(' ')

      this.checkoutForm.get('shipping').patchValue({
        ...shippingAddress,
        country: shippingAddress.country.id,
        firstName: shipFirstName,
        lastName: shipLastName || '',
        state: shippingAddress.stateProvince,
        zip: shippingAddress.postalCode,
        timezone: account.timezone
      })

      this.stepper.next()

      const billingAddress = this.getPartialEcommerceAddress(
        addresses.data,
        AddressLabelType.BILLING
      )

      if (!billingAddress) {
        return
      }

      const [billFirstName, billLastName = ''] = billingAddress.name.split(' ')

      this.checkoutForm.get('billing').patchValue({
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
      this.bus.trigger('checkout.loading.show', false)
    }
  }

  private resolveAutomaticShopifyRedirect(): void {
    this.automaticShopifyRedirect =
      resolveConfig(
        'CHECKOUT.AUTOMATIC_SHOPIFY_REDIRECT',
        this.context.organizationId
      ) ?? false
  }

  private async startRedirection(): Promise<void> {
    this.bus.trigger('checkout.redirection.start', {
      actionButtonType: this.actionButtonType
    })
  }

  private subscribeToRouteEvents(): void {
    this.route.queryParams.pipe(untilDestroyed(this)).subscribe((params) => {
      const hiddenSteps: StepName[] = []

      if ((params.payment as StepState) === 'hidden') {
        hiddenSteps.push('payment')
      }

      if ((params.billing as StepState) === 'hidden') {
        hiddenSteps.push('billing_info')
      }

      if ((params.shipping as StepState) === 'hidden') {
        hiddenSteps.push('shipping_info')
      }

      this.hiddenSteps = hiddenSteps
      this.actionButtonType =
        (params.actionButtonType as ActionButtonType) === 'storefront'
          ? 'storefront'
          : 'dashboard'
    })
  }

  private subscribeToPrefs(): void {
    this.org.pref$.subscribe((pref) => {
      this.logoUrl =
        pref.assets && pref.assets.logoUrl
          ? pref.assets.logoUrl
          : '/assets/logo.png'

      this.spree = makeClient({
        host: pref.storeUrl
      })

      this.storeUrl = pref.storeUrl ?? ''
      this.hasStoreUrl = !!pref.storeUrl
      this.additionalConsentButtons =
        (pref.mala.custom as MALACustomData)?.links?.additionalConsent?.map(
          (entry) => {
            const entryLinks =
              entry.links as AdditionalConsentButtonEntry['links']

            return {
              text: this.removeLinksFromText(
                entry.linkedText as string,
                entryLinks.map((entryLink) => entryLink.url)
              ),
              links: entryLinks
            }
          }
        ) ?? []
    })
  }

  private subscribeToBusEvents(): void {
    this.bus.register('checkout.loading.show', (shouldShow) => {
      this.requestCount += shouldShow ? 1 : -1

      if (this.requestCount <= 0) {
        this.requestCount = 0
        this.showSpinner = false
        return
      }

      this.showSpinner = true
    })
  }

  private removeLinksFromText(text: string, links: string[]): string {
    return links.reduce((cleanText, link) => cleanText.replace(link, ''), text)
  }
}
