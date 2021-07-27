import { Component, Inject, OnInit } from '@angular/core'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { MAT_DIALOG_DATA, MatDialogRef } from '@coachcare/material'
import { _ } from '@coachcare/backend/shared'
import { NotifierService } from '@coachcare/common/services'
import { EmailTemplate, OrganizationProvider } from '@coachcare/sdk'

interface EmailTemplateDialogProps {
  title: string
  emailTemplate: EmailTemplate
  orgId: string
}

interface SelectorOption {
  value: string
  displayValue: string
}

@Component({
  selector: 'ccr-organizations-email-template-dialog',
  templateUrl: './email-template.dialog.html',
  host: {
    class: 'ccr-dialog'
  }
})
export class EmailTemplateDialogComponent implements OnInit {
  categories: SelectorOption[] = [
    {
      value: 'client',
      displayValue: _('EMAIL_TEMPLATE_CATS.CLIENT')
    },
    {
      value: 'other',
      displayValue: _('EMAIL_TEMPLATE_CATS.OTHER')
    }
  ]
  form: FormGroup
  id: string
  operations: SelectorOption[] = [
    {
      value: 'internal-registration',
      displayValue: _('EMAIL_TEMPLATE_OPS.INTERNAL_REGISTRATION')
    },
    {
      value: 'internal-registration-plan',
      displayValue: _('EMAIL_TEMPLATE_OPS.INTERNAL_REGISTRATION_PLAN')
    },
    {
      value: 'new-account',
      displayValue: _('EMAIL_TEMPLATE_OPS.NEW_ACCOUNT')
    },
    {
      value: 'password-reset',
      displayValue: _('EMAIL_TEMPLATE_OPS.PASSWORD_RESET')
    }
  ]
  orgId: string
  title: string

  constructor(
    @Inject(MAT_DIALOG_DATA) private data: EmailTemplateDialogProps,
    private dialog: MatDialogRef<EmailTemplateDialogComponent>,
    private fb: FormBuilder,
    private notify: NotifierService,
    private organization: OrganizationProvider
  ) {}

  ngOnInit(): void {
    this.createForm()
    this.title = _('GLOBAL.CREATE_EMAIL_TEMPLATE')
    if (this.data) {
      this.id = this.data.emailTemplate ? this.data.emailTemplate.id : ''
      if (this.data.emailTemplate) {
        this.form.patchValue(this.data.emailTemplate)
      }
      this.title = this.data.title ? this.data.title : this.title
      this.orgId = this.data.orgId
    }
  }

  async onSubmit() {
    try {
      if (this.id) {
        await this.organization.updateEmailTemplate({
          id: this.id,
          ...this.form.value
        })
      } else {
        await this.organization.createEmailTemplate({
          ...this.form.value,
          organization: this.orgId
        })
      }
      this.notify.success(_('NOTIFY.SUCCESS.EMAIL_TEMPLATE_SAVED'))
      this.dialog.close(true)
    } catch (error) {
      this.notify.error(error)
    }
  }

  private createForm(): void {
    this.form = this.fb.group({
      locale: ['', Validators.required],
      operation: ['', Validators.required],
      category: ['', Validators.required],
      subject: [''],
      html: [''],
      text: ['']
    })
  }
}
