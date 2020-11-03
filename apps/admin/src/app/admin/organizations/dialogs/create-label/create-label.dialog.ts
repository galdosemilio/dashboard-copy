import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@coachcare/common/material';
import { LabelsDatabase } from '@coachcare/backend/data';
import { FormUtils } from '@coachcare/backend/shared';
import { NotifierService } from '@coachcare/common/services';

@Component({
  selector: 'ccr-organizations-create-label-dialog',
  templateUrl: './create-label.dialog.html',
  host: {
    class: 'ccr-dialog ccr-plain',
  },
})
export class CreateLabelDialogComponent implements OnInit {
  public form: FormGroup;
  public isLoading = false;

  constructor(
    private database: LabelsDatabase,
    private dialog: MatDialogRef<CreateLabelDialogComponent>,
    private fb: FormBuilder,
    private notifier: NotifierService
  ) {}

  public ngOnInit(): void {
    this.createForm();
  }

  public async onSubmit(): Promise<void> {
    try {
      this.isLoading = true;
      if (this.form.valid) {
        const response = await this.database.create(this.form.value);
        this.dialog.close(response);
      } else {
        FormUtils.markAsTouched(this.form);
      }
    } catch (error) {
      this.notifier.error(error);
    } finally {
      this.isLoading = false;
    }
  }

  private createForm(): void {
    this.form = this.fb.group({
      title: ['', Validators.required],
      description: [''],
    });
  }
}
