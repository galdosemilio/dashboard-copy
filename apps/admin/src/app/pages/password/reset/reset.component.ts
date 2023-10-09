import { Component, OnInit } from '@angular/core'
import { FormBuilder, FormGroup } from '@angular/forms'
import { MatDialog } from '@coachcare/material'
import { AccountPassword } from '@coachcare/sdk'
import { _, FormUtils } from '@coachcare/backend/shared'
import { ConfirmDialog } from '@coachcare/common/dialogs/core'
import { ContextService } from '@coachcare/common/services'

@Component({
  selector: 'ccr-page-password-reset',
  templateUrl: './reset.component.html',
  host: {
    class: 'ccr-page-card'
  }
})
export class PasswordResetPageComponent implements OnInit {
  form: FormGroup
  isProcessing = false

  constructor(
    private builder: FormBuilder,
    private dialog: MatDialog,
    private password: AccountPassword,
    private context: ContextService
  ) {}

  ngOnInit(): void {
    this.form = this.builder.group({
      email: ''
    })
  }

  onSubmit(): void {
    if (this.isProcessing) {
      return
    }

    if (this.form.valid) {
      this.isProcessing = true

      const request = {
        email: this.form.value.email,
        organization: this.context.organizationId || undefined
      }

      this.password
        .reset(request)
        .then(() => {
          this.dialog.open(ConfirmDialog, {
            data: {
              title: _('GLOBAL.DONE'),
              content: _('NOTIFY.SUCCESS.CHECK_RESET_EMAIL')
            }
          })
          this.isProcessing = false
        })
        .catch((err: string) => {
          this.dialog.open(ConfirmDialog, {
            data: {
              title: _('GLOBAL.ERROR'),
              content: err
            }
          })
          this.isProcessing = false
        })
    } else {
      FormUtils.markAsTouched(this.form)
    }
  }
}
