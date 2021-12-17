import {
  Component,
  forwardRef,
  Input,
  OnInit,
  ViewEncapsulation
} from '@angular/core'
import { ContextService, NotifierService } from '@app/service'
import { UserAddress } from '@app/shared'
import { BindForm, BINDFORM_TOKEN } from '@app/shared/directives'
import { _ } from '@app/shared/utils'
import { AddAddressDialog } from '@app/shared/components/add-address-dialog/add-address.dialog'
import { MatDialog } from '@coachcare/material'
import {
  AddressProvider,
  CreateAccountAddressRequest,
  UpdateAccountAddressRequest
} from '@coachcare/sdk'
import {
  ControlValueAccessor,
  FormArray,
  FormBuilder,
  FormGroup,
  NG_VALUE_ACCESSOR
} from '@angular/forms'
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy'
import { isEmpty, isEqual } from 'lodash'
import { debounceTime, filter } from 'rxjs/operators'
import { Subject } from 'rxjs'
import { PromptDialog } from '@coachcare/common/dialogs/core'
import { resolveConfig } from '@app/config/section'

export interface LabelOption {
  id: string
  name: string
  disabled?: boolean
}

@UntilDestroy()
@Component({
  selector: 'ccr-account-addresses',
  templateUrl: './addresses.component.html',
  styleUrls: ['./addresses.component.scss'],
  encapsulation: ViewEncapsulation.None,
  providers: [
    {
      provide: BINDFORM_TOKEN,
      useExisting: forwardRef(() => AddressesComponent)
    },
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => AddressesComponent),
      multi: true
    }
  ]
})
export class AddressesComponent
  implements BindForm, ControlValueAccessor, OnInit {
  private _account: string

  @Input() set account(value: string) {
    if (this._account !== value) {
      this._account = value

      this.getAddresses()
    }
  }

  get account(): string {
    return this._account
  }

  @Input() markAsTouched: Subject<void>

  @Input() isPatient = false

  set addressesForm(value: FormArray) {
    if (!this.form) {
      return
    }

    this.form.controls['addresses'] = value
  }

  get addressesForm() {
    return this.form?.controls['addresses'] as FormArray
  }

  public form: FormGroup
  public addressLabels: LabelOption[] = []
  public labelOptions: Array<LabelOption & { disabled: boolean }> = []
  public userAddresses: UserAddress[] = []
  public isLoading = false
  public isBillingAddressReadonly = false
  public billingAddressLabelId = '1'

  private propagateChange: (data) => void = () => {}
  private propagateTouched: () => void = () => {}

  constructor(
    private builder: FormBuilder,
    private context: ContextService,
    private addressProvider: AddressProvider,
    private dialog: MatDialog,
    private notifier: NotifierService
  ) {}

  public ngOnInit() {
    this.createForm()
    this.getAddressTypes()

    this.context.organization$.pipe(untilDestroyed(this)).subscribe((org) => {
      this.isBillingAddressReadonly =
        this.isPatient &&
        resolveConfig('PATIENT_FORM.DISABLE_EDIT_BILLING_ADDRESS', org)
    })
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

  public writeValue(): void {
    // we do nothing since the component automatically handles the addresses
  }

  private createForm(): void {
    this.form = this.builder.group({
      addresses: this.builder.array([])
    })

    this.form.valueChanges.pipe(untilDestroyed(this)).subscribe((controls) => {
      this.propagateTouched()
      this.propagateChange(
        this.form.valid
          ? controls.addresses.map((control) => control.address)
          : null
      )
    })
  }

  private createAddressForm(): FormGroup {
    return this.builder.group({
      address: []
    })
  }

  private async getAddressTypes(): Promise<void> {
    const res = await this.addressProvider.getAddressLabels()

    this.addressLabels = res.data.map((item) => ({
      id: item.id.toString(),
      name: item.name
    }))

    this.labelOptions = this.addressLabels.map((label) => ({
      ...label,
      disabled:
        label.id === this.billingAddressLabelId &&
        this.isBillingAddressReadonly &&
        this.userAddresses.some((address) =>
          address.labels.includes(this.billingAddressLabelId)
        )
    }))
  }

  private async getAddresses(): Promise<void> {
    this.userAddresses = []
    this.isLoading = true

    if (!this.account) {
      return
    }

    try {
      const res = await this.addressProvider.getAddressList({
        account: this.account,
        limit: 'all'
      })

      this.userAddresses = res.data.map((item) => ({
        id: item.id.toString(),
        labels: item.labels.map((l) => l.id.toString()),
        address1: item.address1,
        address2: item.address2 ?? null,
        city: item.city,
        stateProvince: item.stateProvince,
        postalCode: item.postalCode,
        country: item.country.id
      }))

      this.addressesForm = new FormArray(
        this.userAddresses.map((address, index) => {
          const addressForm = this.createAddressForm()
          addressForm.setValue({
            address: {
              labels: address.labels,
              address1: address.address1,
              address2: address.address2,
              city: address.city,
              stateProvince: address.stateProvince,
              postalCode: address.postalCode,
              country: address.country
            }
          })

          addressForm.valueChanges
            .pipe(debounceTime(1000), untilDestroyed(this))
            .subscribe((controls) => {
              if (addressForm.valid) {
                this.onChangeAddress(index, controls.address)
              }
            })

          return addressForm
        })
      )
    } catch (err) {
      this.notifier.error(err)
    } finally {
      this.isLoading = false
    }
  }

  public onAddNewAddress(): void {
    if (this._account) {
      return this.openNewAddressDialog()
    }

    this.addressesForm.push(this.createAddressForm())
  }

  private openNewAddressDialog(): void {
    this.dialog
      .open(AddAddressDialog, {
        data: this.addressLabels,
        width: '80vw',
        panelClass: 'ccr-full-dialog'
      })
      .afterClosed()
      .pipe(
        untilDestroyed(this),
        filter((address) => address)
      )
      .subscribe((address: UserAddress) => {
        this.onCreateAddress({
          account: this.account,
          ...address
        })
      })
  }

  private async onCreateAddress(
    data: CreateAccountAddressRequest
  ): Promise<void> {
    this.isLoading = true
    try {
      await this.addressProvider.createAddress(data)
      await this.getAddresses()
    } catch (err) {
      this.notifier.error(err)
    } finally {
      this.isLoading = false
    }
  }

  public onDeleteAddress(index: number): void {
    if (this._account) {
      this.dialog
        .open(PromptDialog, {
          data: {
            title: _('BOARD.DELETE_ADDRESS'),
            content: _('BOARD.DELETE_ADDRESS_DESCRIPTION')
          }
        })
        .afterClosed()
        .pipe(filter((confirm) => confirm))
        .subscribe(() => void this.deleteAddress(this.userAddresses[index].id))
      return
    }

    this.addressesForm.removeAt(index)
  }

  private async deleteAddress(id: string): Promise<void> {
    this.isLoading = true
    try {
      await this.addressProvider.deleteAddress({
        account: this.account,
        id
      })
      await this.getAddresses()
    } catch (err) {
      this.notifier.error(err)
    } finally {
      this.isLoading = false
    }
  }

  public async onChangeAddress(
    index: number,
    address: UserAddress
  ): Promise<void> {
    const originalAddress = this.userAddresses[index]

    const updateData: Partial<UpdateAccountAddressRequest> = {}

    if (!isEqual(address.labels, originalAddress.labels)) {
      updateData.labels = address.labels
    }

    if (address.address1 !== originalAddress.address1) {
      updateData.address1 = address.address1
    }

    if (address.address2 !== originalAddress.address2) {
      updateData.address2 = address.address2
    }

    if (address.city !== originalAddress.city) {
      updateData.city = address.city
    }

    if (address.stateProvince !== originalAddress.stateProvince) {
      updateData.stateProvince = address.stateProvince
    }

    if (address.postalCode !== originalAddress.postalCode) {
      updateData.postalCode = address.postalCode
    }

    if (address.country !== originalAddress.country) {
      updateData.country = address.country
    }

    if (isEmpty(updateData)) {
      return
    }

    try {
      await this.addressProvider.updateAddress({
        account: this.account,
        id: originalAddress.id?.toString(),
        ...updateData
      })
      await this.getAddresses()
    } catch (err) {
      this.notifier.error(err)
    }
  }
}
