import { Component, forwardRef, Input, OnInit } from '@angular/core'
import {
  ControlValueAccessor,
  FormBuilder,
  FormGroup,
  NG_VALUE_ACCESSOR,
  Validators
} from '@angular/forms'
import { AddressLabelType } from '@coachcare/common/model'
import { EventsService, NotifierService } from '@coachcare/common/services'
import {
  AccountAddress,
  AccountProvider,
  AddressProvider,
  Timezone,
  TimezoneResponse
} from '@coachcare/sdk'
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy'
import { TranslateService } from '@ngx-translate/core'
import { Client } from '@spree/storefront-api-v2-sdk'
import { IOAuthToken } from '@spree/storefront-api-v2-sdk/types/interfaces/Token'
import { STATES_LIST, WhitelistedSelectorOption } from '../../shared/model'
import { CheckoutAccountInfo } from '../account-info'

export interface CheckoutShippingInfo {
  firstName: string
  lastName: string
  address1: string
  address2?: string
  city: string
  state: string
  zip: string
  timezone: string
}

@UntilDestroy()
@Component({
  selector: 'ccr-checkout-shipping-info',
  templateUrl: './shipping-info.component.html',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CheckoutShippingInfoComponent),
      multi: true
    }
  ]
})
export class CheckoutShippingInfoComponent
  implements ControlValueAccessor, OnInit
{
  @Input() accountInfo: CheckoutAccountInfo
  @Input() hasStoreUrl: boolean
  @Input() shippingAddress: AccountAddress
  @Input() spree: Client
  @Input() spreeToken: IOAuthToken

  public form: FormGroup
  public lang: string
  public states: WhitelistedSelectorOption[] = STATES_LIST
  public timezones: Array<TimezoneResponse> = this.timezone.fetch()

  private propagateChange: (value) => {}
  private propagateTouched: () => {}

  constructor(
    private accountProvider: AccountProvider,
    private addressProvider: AddressProvider,
    private bus: EventsService,
    private fb: FormBuilder,
    private notifier: NotifierService,
    private timezone: Timezone,
    private translate: TranslateService
  ) {}

  public ngOnInit(): void {
    this.lang = this.translate.currentLang.split('-')[0]
    this.createForm()
  }

  public markAllAsTouched(): void {
    this.form.markAllAsTouched()
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
      if (!this.shippingAddress) {
        await this.createShippingAddress()
      } else {
        await this.updateShippingAddress()
      }
    } catch (error) {
      this.notifier.error(error)
    }
  }

  public writeValue(obj: CheckoutShippingInfo): void {
    if (!this.form) {
      return
    }

    this.form.patchValue(obj)
  }

  private createForm(): void {
    this.form = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      address1: ['', Validators.required],
      address2: [''],
      city: ['', Validators.required],
      state: ['', Validators.required],
      zip: ['', Validators.required],
      timezone: ['', [Validators.required]]
    })

    this.form.valueChanges.pipe(untilDestroyed(this)).subscribe((controls) => {
      this.propagateTouched()
      this.propagateChange(this.form.valid ? controls : null)
    })
  }

  private async createShippingAddress(): Promise<void> {
    try {
      this.bus.trigger('checkout.loading.show', true)
      const accountInfo = this.accountInfo
      const shippingData = this.form.value

      await this.addressProvider.createAddress({
        account: accountInfo.id,
        name: `${shippingData.firstName} ${shippingData.lastName}`,
        address1: shippingData.address1,
        address2: shippingData.address2 || undefined,
        city: shippingData.city,
        postalCode: shippingData.zip,
        stateProvince: shippingData.state,
        country: 'US',
        labels: [AddressLabelType.SHIPPING]
      })

      await this.accountProvider.update({
        id: accountInfo.id,
        timezone: shippingData.timezone
      })

      if (this.hasStoreUrl) {
        const setShipAddressRes = await this.spree.checkout.orderUpdate(
          { bearerToken: this.spreeToken.access_token },
          {
            order: {
              ship_address_attributes: {
                firstname: shippingData.firstName,
                lastname: shippingData.lastName,
                address1: shippingData.address1,
                address2: shippingData.address2 || undefined,
                city: shippingData.city,
                phone: this.accountInfo.phoneNumber,
                zipcode: shippingData.zip,
                state_name: shippingData.state,
                country_iso: 'US'
              }
            }
          }
        )

        if (setShipAddressRes.isFail()) {
          throw new Error(
            `Spree cannot set shipping address. Reason: ${
              setShipAddressRes.fail().message
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

  private async updateShippingAddress(): Promise<void> {
    try {
      this.bus.trigger('checkout.loading.show', true)

      const shippingData = this.form.get('shipping').value

      await this.addressProvider.updateAddress({
        id: this.shippingAddress.id.toString(),
        account: this.accountInfo.id,
        name: `${shippingData.firstName} ${shippingData.lastName}`,
        address1: shippingData.address1,
        address2: shippingData.address2 || null,
        stateProvince: shippingData.state,
        postalCode: shippingData.zip
      })

      await this.accountProvider.update({
        id: this.accountInfo.id,
        timezone: shippingData.timezone
      })
    } catch (error) {
      this.notifier.error(error)
      throw new Error(error)
    } finally {
      this.bus.trigger('checkout.loading.show', false)
    }
  }
}
