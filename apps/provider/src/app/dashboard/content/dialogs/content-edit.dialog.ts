import { Component, forwardRef, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import {
  MAT_DIALOG_DATA,
  MAT_LABEL_GLOBAL_OPTIONS,
  MatDialogRef,
} from '@coachcare/common/material';
import { FileExplorerContent } from '@app/dashboard/content/models';
import { BINDFORM_TOKEN } from '@app/shared';

@Component({
  selector: 'app-content-edit-dialog',
  templateUrl: './content-edit.dialog.html',
  host: { class: 'ccr-dialog' },
  providers: [
    {
      provide: BINDFORM_TOKEN,
      useExisting: forwardRef(() => ContentEditDialog),
    },
    { provide: MAT_LABEL_GLOBAL_OPTIONS, useValue: { float: 'always' } },
  ],
})
export class ContentEditDialog implements OnInit {
  public form: FormGroup;
  public content: FileExplorerContent;
  mode: 'digital-library' | 'vault' = 'digital-library';

  constructor(
    @Inject(MAT_DIALOG_DATA) private data: any,
    private dialogRef: MatDialogRef<ContentEditDialog>,
    private formBuilder: FormBuilder
  ) {}

  ngOnInit(): void {
    this.content = this.data.content;
    this.content.packages = this.data.packages;
    this.mode = this.data.mode || this.mode;

    this.form = this.formBuilder.group({});
  }

  closeDialog(): void {
    this.dialogRef.close();
  }

  updateContent(): void {
    const value = this.form.value,
      returnedValue = Object.assign(
        {},
        this.content,
        ...(value.details.details ? value.details.details : value.details)
      );

    returnedValue.name = returnedValue.fullName
      ? returnedValue.fullName
      : returnedValue.name;

    this.dialogRef.close(returnedValue as FileExplorerContent);
  }
}
