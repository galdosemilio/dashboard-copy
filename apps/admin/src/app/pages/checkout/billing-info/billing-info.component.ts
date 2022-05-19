import {
  Component,
  EventEmitter,
  forwardRef,
  Input,
  OnInit,
  Output,
  ViewChild
} from '@angular/core'
import {
  ControlValueAccessor,
  FormBuilder,
  FormGroup,
  NG_VALUE_ACCESSOR,
  Validators
} from '@angular/forms'
import { STATES_LIST, WhitelistedSelectorOption } from '../../shared/model'
import {
  StripeCardElementOptions,
  StripeElementsOptions
} from '@stripe/stripe-js'
import { StripeCardComponent, StripeService } from 'ngx-stripe'
import { AppStoreFacade } from '@coachcare/common/store'
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy'
import { AddressProvider } from '@coachcare/sdk'
import { IOAuthToken } from '@spree/storefront-api-v2-sdk/types/interfaces/Token'
import { Client } from '@spree/storefront-api-v2-sdk'
import { EventsService, NotifierService } from '@coachcare/common/services'
import { CheckoutAccountInfo } from '../account-info'
import { AddressLabelType } from '@coachcare/common/model'
import { DeviceDetectorService } from 'ngx-device-detector'

export interface CheckoutBillingInfo {
  firstName: string
  lastName: string
  address1: string
  address2?: string
  city: string
  state: string
  zip: string
  cardInfo: {
    expMonth: number
    expYear: number
    id: string
    last4: string
    token: string
    type: string
  }
}

@UntilDestroy()
@Component({
  selector: 'ccr-checkout-billing-info',
  templateUrl: './billing-info.component.html',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CheckoutBillingInfoComponent),
      multi: true
    }
  ]
})
export class CheckoutBillingInfoComponent
  implements ControlValueAccessor, OnInit
{
  @Input() accountInfo: CheckoutAccountInfo
  @Input() cardName: string
  @Input() hasStoreUrl: boolean
  @Input() spree: Client
  @Input() spreeToken: IOAuthToken

  @Input() set allowCreditCard(allowCredCard: boolean) {
    this._allowCreditCard = allowCredCard
    this.refreshCardInfoValidators()
  }

  get allowCreditCard(): boolean {
    return this._allowCreditCard
  }

  @Output()
  onChangeUseShippingAddress: EventEmitter<boolean> = new EventEmitter<boolean>()

  @ViewChild(StripeCardComponent) cardComponent: StripeCardComponent

  public cardOptions: StripeCardElementOptions = {
    style: {
      base: {
        iconColor: '#666EE8',
        color: '#FFFFFF',
        fontWeight: '300',
        fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
        fontSize: '18px',
        '::placeholder': {
          color: '#CFD7E0'
        }
      }
    }
  }
  public elementsOptions: StripeElementsOptions = { locale: 'en' }
  public form: FormGroup
  public isMobileDevice: boolean
  public states: WhitelistedSelectorOption[] = STATES_LIST
  public stripeErrorMessage?: string
  public useShippingAddress = true

  private _allowCreditCard: boolean
  private propagateChange: (value: CheckoutBillingInfo) => {}
  private propagateTouched: () => {}

  constructor(
    private addressProvider: AddressProvider,
    private bus: EventsService,
    private deviceDetector: DeviceDetectorService,
    private fb: FormBuilder,
    private notifier: NotifierService,
    private org: AppStoreFacade,
    private stripeService: StripeService
  ) {}

  public ngOnInit(): void {
    this.isMobileDevice = this.deviceDetector.isMobile()

    this.createForm()
    this.subscribeToPrefs()
    this.onChangeAddressOption(true)
    this.refreshCardInfoValidators()
  }

  public markAllAsTouched(): void {
    this.form.markAllAsTouched()
  }

  public async onChange($event): Promise<void> {
    try {
      if (!$event.complete) {
        return
      }

      const response = await this.stripeService
        .createToken(this.cardComponent.element, { name: this.cardName })
        .toPromise()

      this.form.patchValue({
        cardInfo: {
          token: response.token.id,
          id: response.token.card.id,
          expMonth: response.token.card.exp_month,
          expYear: response.token.card.exp_year,
          last4: response.token.card.last4,
          type: response.token.card.brand
        }
      })
    } catch (error) {
      this.stripeErrorMessage = error
      console.error(error)
    }
  }

  public onChangeAddressOption(value: boolean): void {
    this.useShippingAddress = value
    this.onChangeUseShippingAddress.emit(value)
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
      await this.createBillingAddress()
    } catch (error) {
      this.notifier.error(error)
      throw new Error(error)
    }
  }

  public writeValue(obj: CheckoutBillingInfo): void {
    if (!this.form) {
      return
    }

    this.form.patchValue(obj)
  }

  private async createBillingAddress(): Promise<void> {
    try {
      this.bus.trigger('checkout.loading.show', true)
      const billingData = this.form.value

      await this.addressProvider.createAddress({
        account: this.accountInfo.id,
        name: `${billingData.firstName} ${billingData.lastName}`,
        address1: billingData.address1,
        address2: billingData.address2 || undefined,
        city: billingData.city,
        postalCode: billingData.zip,
        stateProvince: billingData.state,
        country: 'US',
        labels: [AddressLabelType.BILLING]
      })

      if (this.hasStoreUrl) {
        const createAddrRes = await this.spree.account.createAddress(
          { bearerToken: this.spreeToken.access_token },
          {
            address: {
              firstname: billingData.firstName,
              lastname: billingData.lastName,
              address1: billingData.address1,
              address2: billingData.address2 || undefined,
              city: billingData.city,
              phone: this.accountInfo.phoneNumber,
              zipcode: billingData.zip,
              state_name: billingData.state,
              country_iso: 'US'
            }
          }
        )

        if (createAddrRes.isFail()) {
          throw new Error(
            `Spree cannot create address for user. Reason ${
              createAddrRes.fail().message
            }`
          )
        }

        const setBillAddressRes = await this.spree.checkout.orderUpdate(
          { bearerToken: this.spreeToken.access_token },
          {
            order: {
              bill_address_attributes: {
                firstname: billingData.firstName,
                lastname: billingData.lastName,
                address1: billingData.address1,
                address2: billingData.address2 || undefined,
                city: billingData.city,
                phone: this.accountInfo.phoneNumber,
                zipcode: billingData.zip,
                state_name: billingData.state,
                country_iso: 'US'
              }
            }
          }
        )

        if (setBillAddressRes.isFail()) {
          throw new Error(
            `Spree cannot set billing address. Reason: ${
              setBillAddressRes.fail().message
            }`
          )
        }
      }
    } catch (error) {
      this.notifier.error(error)
      throw new Error(error)
    } finally {
      this.bus.trigger('checkout.loading.show', false)
    }
  }

  private createForm(): void {
    this.form = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      address1: ['', Validators.required],
      address2: [''],
      city: ['', Validators.required],
      state: [
        this.isMobileDevice ? this.states[0].value : '',
        [Validators.required]
      ],
      zip: ['', Validators.required],
      cardInfo: [null]
    })

    this.form.valueChanges.pipe(untilDestroyed(this)).subscribe((controls) => {
      this.propagateTouched()
      this.propagateChange(this.form.valid ? controls : null)
    })
  }

  private refreshCardInfoValidators(): void {
    if (!this.form) {
      return
    }

    if (this.allowCreditCard) {
      this.form.get('cardInfo').addValidators(Validators.required)
    } else {
      this.form.get('cardInfo').clearValidators()
    }
  }

  private subscribeToPrefs(): void {
    this.org.pref$.pipe(untilDestroyed(this)).subscribe((prefs) => {
      this.cardOptions.style.base.iconColor = prefs.assets.color.accent
      this.cardOptions.style.base.color = prefs.assets.color.text
      this.cardOptions.style.base['::placeholder'].color =
        prefs.assets.color.text
    })
  }
}
