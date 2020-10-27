import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@coachcare/common/material';

@Component({
  selector: 'app-assign-form-dialog',
  templateUrl: './assign-form.dialog.html',
  host: { class: 'ccr-dialog' },
  encapsulation: ViewEncapsulation.None,
})
export class AssignFormDialog implements OnInit {
  form: FormGroup;

  constructor(
    private dialogRef: MatDialogRef<AssignFormDialog>,
    private fb: FormBuilder
  ) {}

  ngOnInit() {
    this.form = this.fb.group({
      value: ['', Validators.required],
    });
  }

  onSearchChange(formId: string) {
    this.form.patchValue({ value: formId });
  }

  onSubmit() {
    this.dialogRef.close({ form: this.form.controls.value.value });
  }
}
