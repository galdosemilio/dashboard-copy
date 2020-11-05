import { Component, Inject, OnInit } from '@angular/core'
import { MAT_DIALOG_DATA, MatDialogRef } from '@coachcare/common/material'
import { ContextService, NotifierService } from '@app/service'
import { OrganizationEntity } from '@coachcare/npm-api'
import { _ } from '@app/shared/utils'
import { Form as SelveraFormService } from '@coachcare/npm-api'
import { Form } from '../../models'

export interface FormCloneDialogData {
  form: Form
}

@Component({
  selector: 'app-library-form-clone-dialog',
  templateUrl: './form-clone.dialog.html',
  styleUrls: ['./form-clone.dialog.scss'],
  host: { class: 'ccr-dialog' }
})
export class FormCloneDialog implements OnInit {
  public isLoading = false
  public selectedOrganization: OrganizationEntity

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: FormCloneDialogData,
    private context: ContextService,
    private dialogRef: MatDialogRef<FormCloneDialog>,
    private form: SelveraFormService,
    private notifier: NotifierService
  ) {}

  public ngOnInit(): void {
    this.selectedOrganization = this.context.organization
  }

  public onOrganizationSelect(organization: OrganizationEntity): void {
    this.selectedOrganization = organization
  }

  public async onSubmit(): Promise<void> {
    try {
      this.isLoading = true
      await this.form.clone({
        form: this.data.form.id,
        organization: this.selectedOrganization.id
      })

      this.notifier.success(_('NOTIFY.SUCCESS.FORM_CLONED'))
      this.dialogRef.close(true)
    } catch (error) {
      this.notifier.error(error)
    } finally {
      this.isLoading = false
    }
  }
}
