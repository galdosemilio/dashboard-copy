import { Component, Inject, OnInit } from '@angular/core'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { MAT_DIALOG_DATA, MatDialogRef } from '@coachcare/material'
import { ContextService, NotifierService } from '@app/service'
import { _ } from '@app/shared'
import {
  GetUserMFAResponse,
  VerifyDeleteUserMFARequest
} from '@coachcare/npm-api'
import { MFA } from '@coachcare/npm-api'
import { MFAVerificatorMode } from '../../mfa-verificator'
import { MFAChannels } from '../../models'

export interface VerifyDeleteMFADialogProps {
  existingMFA: GetUserMFAResponse
}

@Component({
  selector: 'account-verify-delete-mfa',
  templateUrl: './verify-delete-mfa.dialog.html',
  host: { class: 'ccr-dialog' },
  styleUrls: ['./verify-delete-mfa.dialog.scss']
})
export class VerifyDeleteMFADialog implements OnInit {
  existingMFA: GetUserMFAResponse
  form: FormGroup
  isLoading = false
  maskedPhone: string
  mode: MFAVerificatorMode

  constructor(
    @Inject(MAT_DIALOG_DATA) private data: VerifyDeleteMFADialogProps,
    private context: ContextService,
    private dialog: MatDialogRef<VerifyDeleteMFADialog>,
    private fb: FormBuilder,
    private mfa: MFA,
    private notify: NotifierService
  ) {}

  ngOnInit() {
    this.generateMaskedPhone()
    this.createForm()
    this.mapDialogData()
  }

  async onSubmit() {
    try {
      const form = this.form.value
      const request: VerifyDeleteUserMFARequest = {
        id: this.existingMFA.id || '',
        token: {
          type: this.mode === 'backup_code' ? 'backup' : 'totp',
          value: form.code ? form.code.replace(/\s/g, '') : ''
        }
      }
      this.isLoading = true
      await this.mfa.verifyDeleteUserMFA(request)
      this.dialog.close()
      this.notify.success(_('NOTIFY.SUCCESS.MFA_DISABLED'))
    } catch (error) {
      this.notify.error(error)
    } finally {
      this.isLoading = false
    }
  }

  onUseBackupCode(): void {
    this.mode = 'backup_code'
  }

  onUseVerificationCode(): void {
    this.mode = MFAChannels[this.existingMFA.channel.id]
      .code as MFAVerificatorMode
  }

  private createForm(): void {
    this.form = this.fb.group({
      code: ['', Validators.required]
    })
  }

  private generateMaskedPhone(): void {
    this.maskedPhone = this.context.user.phone || ''
    this.maskedPhone = this.maskedPhone.replace(
      new RegExp(`^\\+?\\d{0,${this.maskedPhone.length - 4}}`),
      new Array(this.maskedPhone.length - 4).fill('*').join('')
    )
  }

  private mapDialogData(): void {
    this.existingMFA = this.data.existingMFA
    this.mode = MFAChannels[this.existingMFA.channel.id]
      .code as MFAVerificatorMode
  }
}
