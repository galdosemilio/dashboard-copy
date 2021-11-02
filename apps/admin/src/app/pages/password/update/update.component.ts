import {
  Component,
  forwardRef,
  Inject,
  OnInit,
  ViewEncapsulation
} from '@angular/core'
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms'
import { MatDialog } from '@coachcare/material'
import { ActivatedRoute, Router } from '@angular/router'
import { MFACodeInputMode } from '@board/shared/mfa-code-input'
import {
  AccountPassword,
  AccountTypeIds,
  UpdateAccountPasswordResponse
} from '@coachcare/sdk'
import { _, FormUtils } from '@coachcare/backend/shared'
import { ConfirmDialog } from '@coachcare/common/dialogs/core'
import { BINDFORM_TOKEN } from '@coachcare/common/directives'
import { ContextService, NotifierService } from '@coachcare/common/services'
import { APP_ENVIRONMENT, AppEnvironment } from '@coachcare/common/shared'
import {
  CustomCheckboxConfig,
  resolveConfig
} from '@board/pages/config/section.config'
import { ClinicMsaProps } from '@coachcare/common/components'

@Component({
  selector: 'ccr-page-password-update',
  templateUrl: './update.component.html',
  styleUrls: ['./update.component.scss'],
  host: {
    class: 'ccr-page-card'
  },
  providers: [
    {
      provide: BINDFORM_TOKEN,
      useValue: forwardRef(() => PasswordUpdatePageComponent)
    }
  ],
  encapsulation: ViewEncapsulation.None
})
export class PasswordUpdatePageComponent implements OnInit {
  accountType: string
  clinicMsa?: ClinicMsaProps
  clinicNewsletterCheckboxText?: string
  consentRequired: string | undefined
  customCheckboxConfig?: CustomCheckboxConfig
  serverError: string
  form: FormGroup
  formType: 'update' | 'create' = 'update'
  isProcessing = false
  mfaForm: FormGroup
  mode: MFACodeInputMode = 'default'

  constructor(
    @Inject(APP_ENVIRONMENT) private environment: AppEnvironment,
    private builder: FormBuilder,
    private context: ContextService,
    private dialog: MatDialog,
    private notify: NotifierService,
    private password: AccountPassword,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    this.resolveClinicMsa()
    this.form = this.builder.group({
      email: '',
      code: '',
      password: '',
      consent: undefined,
      retry: true
    })
    this.mfaForm = this.builder.group({})

    this.route.queryParams.subscribe((params: any) => {
      this.accountType = params.accountType
      this.consentRequired = params.consentRequired
      this.formType = params.type === 'create' ? 'create' : 'update'
      this.form.patchValue({
        email: params.email || '',
        code: params.code || '',
        consent: this.consentRequired ? false : undefined
      })

      this.resolveClinicCustomCheckbox()

      if (this.consentRequired && this.customCheckboxConfig) {
        this.form.addControl(
          this.customCheckboxConfig.fieldName,
          new FormControl(undefined, [Validators.requiredTrue])
        )
      }
    })
  }

  async onSubmit() {
    try {
      if (this.isProcessing) {
        return
      }

      if (this.form.valid) {
        delete this.serverError
        this.isProcessing = true

        const response = (await this.password.update({
          ...this.form.value,
          organization:
            this.context.organizationId || this.environment.defaultOrgId
        })) as UpdateAccountPasswordResponse

        if (response && response.mfa) {
          this.detectMFA(response)
        } else {
          this.showSuccessDialog()
        }
      } else {
        FormUtils.markAsTouched(this.form)
      }
    } catch (error) {
      this.dialog.open(ConfirmDialog, {
        data: {
          title: _('GLOBAL.ERROR'),
          content: error
        }
      })
      this.serverError = error
    } finally {
      this.isProcessing = false
    }
  }

  setMode(mode: MFACodeInputMode): void {
    this.mode = mode
  }

  async onSubmitMFA() {
    try {
      if (this.isProcessing) {
        return
      }

      this.isProcessing = true
      await this.password.updatePasswordMFA({
        ...this.form.value,
        organization:
          this.context.organizationId || this.environment.defaultOrgId,
        token: {
          type: this.mode === 'backup_code' ? 'backup' : 'totp',
          value: this.mfaForm.value.code.code
            ? this.mfaForm.value.code.code.replace(/\s/g, '')
            : ''
        }
      })
      this.showSuccessDialog()
    } catch (error) {
      this.mode = 'default'
      this.serverError = error
      this.notify.error(error)
    } finally {
      this.isProcessing = false
    }
  }

  private resolveClinicMsa(): void {
    const clinicMsaSetting = !!resolveConfig(
      'REGISTER.CLINIC_MSA',
      this.context.organizationId
    )

    if (!clinicMsaSetting) {
      return
    }

    const clinicMsaLinkSetting = resolveConfig(
      'REGISTER.CLINIC_MSA_LINK',
      this.context.organizationId
    )
    const clinicMsaLinkLabelSetting = resolveConfig(
      'REGISTER.CLINIC_MSA_LINK_LABEL',
      this.context.organizationId
    )

    this.clinicMsa = {
      link:
        typeof clinicMsaLinkSetting === 'string' ? clinicMsaLinkSetting : '',
      label:
        typeof clinicMsaLinkLabelSetting === 'string'
          ? clinicMsaLinkLabelSetting
          : ''
    }
  }

  private resolveClinicCustomCheckbox(): void {
    const clinicCustomCheckboxConfig: CustomCheckboxConfig = resolveConfig(
      'REGISTER.CLINIC_PW_RES_CUSTOM_CHECKBOX',
      this.context.organizationId
    )

    if (
      !clinicCustomCheckboxConfig?.supportedAccTypes.includes(
        this.accountType as AccountTypeIds
      )
    ) {
      return
    }

    this.customCheckboxConfig = clinicCustomCheckboxConfig
  }

  private detectMFA(response: UpdateAccountPasswordResponse) {
    if (response.mfa) {
      switch (response.mfa.channel.id) {
        case '1':
          this.mode = 'auth'
          break
        case '2':
          this.mode = 'mfa_sms'
          break
        default:
          break
      }
    } else {
    }
  }

  private showSuccessDialog(): void {
    const dialogConfirm = this.dialog.open(ConfirmDialog, {
      data: {
        title: _('GLOBAL.DONE'),
        content:
          this.formType === 'create'
            ? _('NOTIFY.SUCCESS.PASSWORD_SETTED')
            : _('NOTIFY.SUCCESS.PASSWORD_RESET')
      }
    })

    dialogConfirm.afterClosed().subscribe(() => {
      this.router.navigate(
        ['/'],
        this.accountType
          ? { queryParams: { accountType: this.accountType } }
          : undefined
      )
    })
  }
}
