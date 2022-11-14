import { Component, Inject, OnInit } from '@angular/core'
import { FormBuilder, FormGroup } from '@angular/forms'
import { ConfirmDialog } from '@coachcare/common/dialogs/core'
import { ContextService, NotifierService } from '@coachcare/common/services'
import { _ } from '@coachcare/common/shared'
import { MAT_DIALOG_DATA, MatDialogRef, MatDialog } from '@coachcare/material'
import { AccountPassword } from '@coachcare/sdk'

interface ResetPasswordInvalidData {
  email: string
}

@Component({
  selector: 'ccr-dialog-reset-password-invalid',
  templateUrl: 'reset-password-invalid.dialog.html',
  styleUrls: ['./reset-password-invalid.dialog.scss'],
  host: { class: 'ccr-dialog' }
})
export class ResetPasswordInvalidDialog implements OnInit {
  public form: FormGroup
  public isProcessing = false

  constructor(
    private builder: FormBuilder,
    private context: ContextService,
    private notifier: NotifierService,
    private password: AccountPassword,
    private dialog: MatDialog,
    public dialogRef: MatDialogRef<ResetPasswordInvalidData>,
    @Inject(MAT_DIALOG_DATA) public data: ResetPasswordInvalidData
  ) {
    dialogRef.disableClose = true
  }

  ngOnInit() {
    this.createForm()
  }

  private createForm(): void {
    this.form = this.builder.group({
      email: ''
    })
    this.form.patchValue({
      email: this.data.email
    })
  }

  public async onSubmit(): Promise<void> {
    if (this.isProcessing) {
      return
    }

    if (this.form.invalid) {
      return
    }

    try {
      const request = {
        email: this.form.value.email,
        organization: this.context.organizationId || undefined
      }

      await this.password.reset(request)

      this.dialogRef.close()
      this.dialog.open(ConfirmDialog, {
        data: {
          title: _('GLOBAL.DONE'),
          content: _('NOTIFY.SUCCESS.CHECK_RESET_EMAIL')
        }
      })
    } catch (error) {
      this.notifier.error(error)
    } finally {
      this.isProcessing = false
    }
  }
}
