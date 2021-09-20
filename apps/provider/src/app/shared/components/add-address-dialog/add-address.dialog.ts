import { Component, Inject, OnInit, forwardRef } from '@angular/core'
import { FormBuilder, FormGroup } from '@angular/forms'
import { FormUtils } from '@app/shared/utils'
import { MatDialogRef, MAT_DIALOG_DATA } from '@coachcare/material'
import { AddressLabel } from '@coachcare/sdk'
import { Subject } from 'rxjs'
import { BINDFORM_TOKEN } from '../../directives'
import { UserAddress } from '@app/shared/model'

@Component({
  selector: 'add-address-dialog',
  templateUrl: './add-address.dialog.html',
  host: { class: 'ccr-dialog' },
  styleUrls: ['./add-address.dialog.scss'],
  providers: [
    {
      provide: BINDFORM_TOKEN,
      useExisting: forwardRef(() => AddAddressDialog)
    }
  ]
})
export class AddAddressDialog implements OnInit {
  public form: FormGroup
  public addressLabels: AddressLabel[]
  public markAsTouched$: Subject<void> = new Subject<void>()

  constructor(
    @Inject(MAT_DIALOG_DATA) private data: AddressLabel[],
    private dialog: MatDialogRef<AddAddressDialog>,
    private fb: FormBuilder,
    private formUtils: FormUtils
  ) {}

  public ngOnInit() {
    this.addressLabels = this.data
    this.createForm()
  }

  public onSubmit(): void {
    if (this.form.valid) {
      const address: UserAddress = this.form.value.address
      this.dialog.close(address)
    } else {
      this.formUtils.markAsTouched(this.form)
      this.markAsTouched$.next()
    }
  }

  private createForm(): void {
    this.form = this.fb.group({
      address: []
    })
  }
}
