import { Component, Input, OnInit } from '@angular/core'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { NotifierService } from '@app/service'
import { _ } from '@app/shared/utils'
import { AddressLabelType } from '@coachcare/common/model'
import {
  AccountAddress,
  AccountProvider,
  AccSingleResponse,
  AddressProvider
} from '@coachcare/sdk'
import { take } from 'rxjs/operators'

type AccountContactInfoComponentMode = 'edit' | 'readonly'

@Component({
  selector: 'app-account-contact-info',
  templateUrl: './account-contact-info.component.html'
})
export class AccountContactInfoComponent implements OnInit {
  @Input() accountId: string
  @Input() initialMode: AccountContactInfoComponentMode = 'edit'

  public account: AccSingleResponse
  public address?: AccountAddress
  public form: FormGroup
  public isLoading = false
  public mode: AccountContactInfoComponentMode
  public readonly = false

  private initialFormValue: { [key: string]: unknown }

  constructor(
    private accountProvider: AccountProvider,
    private addressProvider: AddressProvider,
    private fb: FormBuilder,
    private notifier: NotifierService
  ) {}

  public ngOnInit(): void {
    this.setMode(this.initialMode)
    this.createForm()
    void this.fetchAccountData()
  }

  public async onSubmit(): Promise<void> {
    try {
      if (this.isLoading) {
        return
      }
      this.isLoading = true

      const values = this.form.value

      await this.accountProvider.update({
        id: this.account.id,
        email: values.email,
        phone: values.phone
      })

      if (!this.address) {
        await this.addressProvider.createAddress({
          labels: [AddressLabelType.BILLING],
          account: this.accountId,
          address1: values.address1,
          city: values.city,
          stateProvince: values.state,
          postalCode: values.postalCode,
          country: 'US'
        })
      } else {
        await this.addressProvider.updateAddress({
          id: this.address.id.toString(),
          account: this.accountId,
          address1: values.address1,
          city: values.city,
          stateProvince: values.state,
          postalCode: values.postalCode
        })
      }

      this.notifier.success(_('NOTIFY.SUCCESS.PROFILE_UPDATED'))

      this.loadInitialFormValue()
      this.setMode('readonly')
    } catch (error) {
      this.notifier.error(error)
    } finally {
      this.isLoading = false
    }
  }

  public setMode(mode: AccountContactInfoComponentMode): void {
    this.mode = mode
    this.readonly = mode === 'readonly'

    if (mode === 'edit') {
      this.loadInitialFormValue()
    } else if (this.form) {
      this.form.patchValue({ ...this.initialFormValue })
    }
  }

  private createForm(): void {
    this.form = this.fb.group({
      phoneNumber: ['', Validators.required],
      email: ['', Validators.required],
      address1: ['', Validators.required],
      city: ['', Validators.required],
      state: ['', Validators.required],
      postalCode: ['', Validators.required]
    })

    this.form.valueChanges
      .pipe(take(1))
      .subscribe(() => this.loadInitialFormValue())
  }

  private async fetchAccountData(): Promise<void> {
    try {
      const accountResponse = await this.accountProvider.getSingle(
        this.accountId
      )

      const addressResponse = await this.addressProvider.getAddressList({
        account: this.accountId,
        limit: 'all'
      })

      const billingAddress = addressResponse.data.find((entry) =>
        entry.labels.some(
          (label) => label.id.toString() === AddressLabelType.BILLING
        )
      )

      this.account = accountResponse

      this.form.patchValue({
        phoneNumber: this.account.phone,
        email: this.account.email
      })

      if (!billingAddress) {
        return
      }

      this.address = billingAddress

      this.form.patchValue({
        address1: billingAddress.address1,
        city: billingAddress.city,
        state: billingAddress.stateProvince,
        postalCode: billingAddress.postalCode
      })
    } catch (error) {
      this.notifier.error(error)
    }
  }

  private loadInitialFormValue(): void {
    this.initialFormValue = { ...this.form.value }
  }
}
