import { Component, forwardRef, Inject, OnInit } from '@angular/core'
import { FormBuilder, FormGroup } from '@angular/forms'
import {
  MAT_DIALOG_DATA,
  MAT_LABEL_GLOBAL_OPTIONS,
  MatDialogRef
} from '@coachcare/material'
import { Form } from '@app/dashboard/library/forms/models'
import { BindForm, BINDFORM_TOKEN } from '@app/shared'

@Component({
  selector: 'app-library-form-edit-dialog',
  templateUrl: './form-edit.dialog.html',
  styleUrls: ['./form-edit.dialog.scss'],
  host: { class: 'ccr-dialog' },
  providers: [
    {
      provide: BINDFORM_TOKEN,
      useExisting: forwardRef(() => FormEditDialog)
    },
    { provide: MAT_LABEL_GLOBAL_OPTIONS, useValue: { float: 'always' } }
  ]
})
export class FormEditDialog implements BindForm, OnInit {
  public form: FormGroup

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: Form,
    private dialogRef: MatDialogRef<FormEditDialog>,
    private formBuilder: FormBuilder
  ) {}

  ngOnInit(): void {
    this.createForm()
  }

  cancel(): void {
    this.dialogRef.close()
  }

  closeDialog(): void {
    this.dialogRef.close(this.form.value.details)
  }

  private createForm(): void {
    this.form = this.formBuilder.group({})
  }
}
