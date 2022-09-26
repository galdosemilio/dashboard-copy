import { Component, OnInit, ViewEncapsulation } from '@angular/core'
import { MatDialogRef } from '@coachcare/material'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { OrganizationEntity } from '@coachcare/sdk'
import { FormUtils } from '@coachcare/common/shared'
import { TaskDatabase } from '../../services'
import { NotifierService } from '@app/service'

@Component({
  selector: 'app-create-patient-bulk-report-dialog',
  templateUrl: './create-patient-bulk-report.dialog.html',
  styleUrls: ['./create-patient-bulk-report.dialog.scss'],
  host: { class: 'ccr-dialog' },
  encapsulation: ViewEncapsulation.None
})
export class CreatePatientBulkReportDialog implements OnInit {
  form: FormGroup

  constructor(
    private dialogRef: MatDialogRef<CreatePatientBulkReportDialog>,
    private database: TaskDatabase,
    private fb: FormBuilder,
    private notifier: NotifierService
  ) {}

  ngOnInit(): void {
    this.createForm()
  }

  private createForm(): void {
    this.form = this.fb.group({
      name: ['', Validators.required],
      organization: ['', Validators.required],
      endDate: ['', Validators.required],
      startDate: ['', Validators.required],
      format: ['pdf']
    })
  }

  public onSelectClinic(clinic: OrganizationEntity): void {
    this.form.patchValue({
      organization: clinic.id ?? null
    })
  }

  public closeDialog(): void {
    this.dialogRef.close()
  }

  public onSubmit(): void {
    if (this.form.valid) {
      void this.onCreateReport()
    } else {
      FormUtils.markAsTouched(this.form)
    }
  }

  private async onCreateReport(): Promise<void> {
    const formValue = this.form.value

    try {
      await this.database.createTask({
        organization: formValue.organization,
        type: 1,
        name: formValue.name,
        parameters: {
          start: formValue.startDate.startOf('day').toISOString(),
          end: formValue.endDate.endOf('day').toISOString(),
          format: [formValue.format]
        }
      })

      this.dialogRef.close(true)
    } catch (err) {
      this.notifier.error(err)
    }
  }
}
