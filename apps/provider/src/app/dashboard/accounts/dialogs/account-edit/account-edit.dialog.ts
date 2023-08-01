import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core'
import { FormBuilder, FormGroup } from '@angular/forms'
import { MAT_DIALOG_DATA, MatDialogRef } from '@coachcare/material'
import { NotifierService } from '@app/service'
import * as moment from 'moment'
import { AccountProvider } from '@coachcare/sdk'

export interface AccountEditDialogData {
  id: string
  firstName: string
  lastName: string
  email: string
  startedAt: string
}

@Component({
  selector: 'app-account-edit-dialog',
  templateUrl: 'account-edit.dialog.html',
  host: { class: 'ccr-dialog' },
  encapsulation: ViewEncapsulation.None
})
export class AccountEditDialog implements OnInit {
  form: FormGroup

  constructor(
    private builder: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: AccountEditDialogData,
    private dialogRef: MatDialogRef<AccountEditDialog>,
    private account: AccountProvider,
    private notifier: NotifierService
  ) {}

  ngOnInit() {
    this.createForm()
  }

  createForm() {
    this.form = this.builder.group({
      id: undefined,
      firstName: '',
      lastName: '',
      email: '',
      startedAt: ''
    })
    this.form.patchValue({
      ...this.data,
      startedAt: this.data.startedAt ? moment(this.data.startedAt) : moment()
    })
  }

  async onSubmit() {
    if (this.form.invalid) {
      return
    }

    try {
      const data = this.form.value
      const acc = await this.account.getSingle(data.id)

      await this.account.update({
        ...data,
        client: {
          ...acc.clientData,
          startedAt: data.startedAt.format('YYYY-MM-DD')
        }
      })

      // return the result to the caller component
      this.dialogRef.close(data)
    } catch (error) {
      this.notifier.error(error)
    }
  }
}
