import { Component, OnInit } from '@angular/core'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { ccrPhoneValidator } from '@board/shared/phone-input'
import {
  Account,
  AccountTypeIds,
  CreateUserMFARequest,
  CreateUserMFAResponse,
  MFA,
  Session,
  VerifyUserMFARequest
} from '@coachcare/npm-api'
import { _, CcrRolesMap } from '@coachcare/backend/shared'
import {
  AuthService,
  ContextService,
  NotifierService
} from '@coachcare/common/services'
import {
  AuthenticatorApp,
  AuthenticatorApps,
  MFAChannel,
  MFAChannels
} from './models'

type MFASetupPageModes =
  | 'auth'
  | 'backup_codes'
  | 'sms'
  | 'default'
  | 'backup_codes'
export interface MFAVerificatorResetOpts {
  emitEvent?: boolean
}

@Component({
  selector: 'ccr-page-mfa-setup',
  styleUrls: ['./mfa-setup.component.scss'],
  templateUrl: './mfa-setup.component.html'
})
export class MFASetupPageComponent implements OnInit {
  authApps: AuthenticatorApp[]
  backupCodes: string[]
  channel: MFAChannel
  currentMfa: CreateUserMFAResponse
  form: FormGroup
  isLoading: boolean
  mode: MFASetupPageModes = 'default'
  phoneForm: FormGroup
  qrData: string
  secretKey: string

  constructor(
    private account: Account,
    private auth: AuthService,
    private context: ContextService,
    private fb: FormBuilder,
    private mfa: MFA,
    private notify: NotifierService,
    private session: Session
  ) {}

  async ngOnInit() {
    this.resolveMFAChannel()
    this.resolveAuthApps()
    this.form = this.fb.group({ code: ['', Validators.required] })
    this.phoneForm = this.fb.group({ phone: ['', Validators.required] })
    this.phoneForm = this.fb.group({
      phone: [
        {
          phone: this.context.user.phone,
          countryCode: this.context.user.countryCode
        },
        [ccrPhoneValidator]
      ]
    })
    await this.checkExistingMFA()
  }

  async onAccept() {
    try {
      this.isLoading = true
      if (this.currentMfa) {
        await this.deleteExistingMFA(this.currentMfa)
      }

      const request: CreateUserMFARequest = {
        channel: this.channel.id,
        organization: this.context.organizationId || ''
      }
      this.currentMfa = await this.mfa.createUserMFA(request)
      this.qrData = decodeURIComponent(this.currentMfa.qrCodeUrl || '')
      this.mode = this.channel.code as MFASetupPageModes

      const qrDataMatch = this.qrData
        ? this.qrData.match(/secret\=[a-zA-Z0-9]*/)
        : ''

      this.secretKey = qrDataMatch ? qrDataMatch[0].replace(/secret\=/, '') : ''
    } catch (error) {
      this.notify.error(error)
    } finally {
      this.isLoading = false
    }
  }

  async onCancel() {
    try {
      this.isLoading = true
      await this.checkExistingMFA()
      await this.session.logout()
      this.auth.logout()
    } catch (error) {
      this.notify.error(error)
    } finally {
      this.isLoading = false
    }
  }

  async onSubmit() {
    try {
      const form = this.form.value
      const request: VerifyUserMFARequest = {
        id: this.currentMfa.id,
        code: form.code && form.code ? form.code.replace(/\s/g, '') : ''
      }
      this.isLoading = true
      const backupCodes = await this.mfa.verifyUserMFA(request)
      this.notify.success(_('NOTIFY.SUCCESS.MFA_VERIFIED'))
      this.backupCodes = backupCodes.data
      this.mode = 'backup_codes'
    } catch (error) {
      this.notify.error(error)
    } finally {
      this.isLoading = false
    }
  }

  async onSelectAuth() {
    this.channel = MFAChannels['1']
    await this.onAccept()
    this.mode = 'auth'
  }

  async onSelectSMS() {
    this.channel = MFAChannels['2']
    await this.onAccept()
    this.mode = 'sms'
  }

  async onSubmitPhone() {
    try {
      this.isLoading = true
      const form = this.phoneForm.value
      await this.account.update({
        id: this.context.user.id,
        phone: form.phone.phone,
        countryCode: form.phone.countryCode
      })
      this.notify.success(_('NOTIFY.SUCCESS.PHONE_NUMBER_UPDATED'))
    } catch (error) {
      this.notify.error(error)
    } finally {
      this.isLoading = false
    }
  }

  async onContinue() {
    try {
      this.isLoading = true
      const role = CcrRolesMap(AccountTypeIds.Provider)
      this.auth.login(role)
    } catch (error) {
      this.notify.error(error)
    } finally {
      this.isLoading = false
    }
  }

  onDownloadBackupCodes() {
    let text = ''
    const filename = `${this.channel.name}_${this.context.organization.name}_backup_codes`

    this.backupCodes.forEach((code) => {
      text += `${code}\r\n`
    })

    const blob = new Blob([text], { type: 'text/plain;charset=utf8;' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.setAttribute('visibility', 'hidden')
    link.download = filename
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  onReset(opts: MFAVerificatorResetOpts = {}): void {
    this.form.reset({ valid: true })
  }

  private async checkExistingMFA() {
    try {
      const existingMFA = await this.mfa.getUserMFA({
        organization: this.context.organizationId || ''
      })

      if (existingMFA && !existingMFA.isVerified) {
        await this.mfa.deleteUserMFA({
          id: existingMFA.id,
          organization: this.context.organizationId || ''
        })
      }
    } catch (error) {}
  }

  private deleteExistingMFA(existingMFA: CreateUserMFAResponse): Promise<void> {
    return new Promise<void>(async (resolve) => {
      try {
        await this.mfa.deleteUserMFA({
          id: existingMFA.id,
          organization: this.context.organizationId || ''
        })
      } catch (error) {
      } finally {
        resolve()
      }
    })
  }

  private resolveMFAChannel(): void {
    Object.keys(MFAChannels).forEach((key) => {
      if (MFAChannels[key].code === this.mode) {
        this.channel = MFAChannels[key]
      }
    })
  }

  private resolveAuthApps(): void {
    this.authApps = Object.keys(AuthenticatorApps).map(
      (key) => AuthenticatorApps[key]
    )
  }
}
