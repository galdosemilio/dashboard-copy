import { Component, forwardRef } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import {
  MAT_LABEL_GLOBAL_OPTIONS,
  MatDialogRef,
} from '@coachcare/common/material';
import { BindForm, BINDFORM_TOKEN } from '@app/shared';

@Component({
  selector: 'app-library-form-create-dialog',
  templateUrl: './form-create.dialog.html',
  styleUrls: ['./form-create.dialog.scss'],
  host: { class: 'ccr-dialog' },
  providers: [
    {
      provide: BINDFORM_TOKEN,
      useExisting: forwardRef(() => FormCreateDialog),
    },
    { provide: MAT_LABEL_GLOBAL_OPTIONS, useValue: { float: 'always' } },
  ],
})
export class FormCreateDialog implements BindForm {
  public form: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private dialogRef: MatDialogRef<FormCreateDialog>
  ) {
    this.createForm();
  }

  cancel(): void {
    this.dialogRef.close();
  }

  closeDialog(): void {
    this.dialogRef.close(this.form.value.details);
  }

  private createForm(): void {
    this.form = this.formBuilder.group({});
  }
}
