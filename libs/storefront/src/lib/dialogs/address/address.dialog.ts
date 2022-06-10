import { Component, Inject, OnInit } from '@angular/core'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog'
import { FormUtils } from '@coachcare/common/shared'
import { AccountAddress } from '@coachcare/sdk'
import { UntilDestroy } from '@ngneat/until-destroy'

export interface StoreFrontAddressData {
  title: string
  address?: AccountAddress
}

@UntilDestroy()
@Component({
  selector: 'ccr-storefront-address-dialog',
  templateUrl: './address.dialog.html',
  host: { class: 'ccr-dialog' },
  styleUrls: ['./address.dialog.scss']
})
export class StorefrontAddressDialog implements OnInit {
  public title: string
  public form: FormGroup

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: StoreFrontAddressData,
    private dialogRef: MatDialogRef<{ id: string; qty: number }>,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.createForm()
    this.title = this.data.title

    if (this.data.address) {
      this.patchValues(this.data.address)
    }
  }

  private patchValues(address: AccountAddress) {
    this.form.patchValue({
      address1: address.address1,
      address2: address.address2,
      city: address.city,
      stateProvince: address.stateProvince,
      country: address.country?.id,
      postalCode: address.postalCode
    })
  }

  private createForm(): void {
    this.form = this.fb.group({
      address1: ['', Validators.required],
      address2: null,
      city: ['', Validators.required],
      stateProvince: ['', Validators.required],
      postalCode: ['', Validators.required],
      country: ['US', Validators.required]
    })
  }

  async onSubmit(): Promise<void> {
    if (this.form.invalid) {
      FormUtils.markAsTouched(this.form)
      return
    }

    this.dialogRef.close(this.form.value)
  }
}
