import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core'
import {
  ContextService,
  CurrentAccount,
  FormDisplayService,
  NotifierService
} from '@app/service'
import { Form } from '@app/shared/model'
import { MatDialogRef, MAT_DIALOG_DATA } from '@coachcare/material'
import { Form as FormProvider } from '@coachcare/sdk'
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy'

export interface FormFillDialogData {
  formId: string
}

@UntilDestroy()
@Component({
  selector: 'ccr-form-fill-dialog',
  templateUrl: './form-fill.dialog.html',
  styleUrls: ['./form-fill.dialog.scss'],
  encapsulation: ViewEncapsulation.None
})
export class FormFillDialog implements OnInit {
  public account: CurrentAccount
  public form: Form

  constructor(
    private context: ContextService,
    @Inject(MAT_DIALOG_DATA) private data: FormFillDialogData,
    private dialogRef: MatDialogRef<FormFillDialog>,
    private formDisplay: FormDisplayService,
    private formProvider: FormProvider,
    private notifier: NotifierService
  ) {}

  public ngOnInit(): void {
    this.account = this.context.user
    this.subscribeToEvents()
    void this.fetchForm()
  }

  private async fetchForm(): Promise<void> {
    try {
      const form = await this.formProvider.getSingle({
        id: this.data.formId,
        full: true
      })

      this.form = new Form(form)
    } catch (error) {
      this.notifier.error(error)
      this.dialogRef.close()
    }
  }

  private subscribeToEvents(): void {
    this.formDisplay.saved$
      .pipe(untilDestroyed(this))
      .subscribe(() => this.dialogRef.close())
  }
}
