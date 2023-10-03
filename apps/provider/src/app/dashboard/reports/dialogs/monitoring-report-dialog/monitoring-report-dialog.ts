import { Component, OnInit, ViewEncapsulation } from '@angular/core'
import { MatDialogRef } from '@coachcare/material'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { FormUtils, SelectorOption } from '@coachcare/common/shared'
import { ContextService } from '@app/service'
import { STORAGE_CARE_MANAGEMENT_SERVICE_TYPE } from '@app/config'
import { _ } from '@app/shared'

@Component({
  selector: 'app-monitoring-report-dialog',
  templateUrl: './monitoring-report-dialog.html',
  host: { class: 'ccr-dialog' },
  encapsulation: ViewEncapsulation.None
})
export class MonitoringReportDialog implements OnInit {
  form: FormGroup
  public serviceTypes: SelectorOption[] = []

  constructor(
    private context: ContextService,
    private dialogRef: MatDialogRef<MonitoringReportDialog>,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.serviceTypes = [
      {
        viewValue: _('GLOBAL.ALL'),
        value: 'all'
      },
      ...this.context.user.careManagementServiceTypes.map((serviceType) => ({
        viewValue: serviceType.name,
        value: serviceType.id
      }))
    ]
    this.createForm()
  }

  private createForm(): void {
    const serviceType = window.localStorage.getItem(
      STORAGE_CARE_MANAGEMENT_SERVICE_TYPE
    )

    this.form = this.fb.group({
      serviceType: [serviceType, Validators.required]
    })
  }

  public closeDialog(): void {
    this.dialogRef.close()
  }

  public onSubmit(): void {
    if (!this.form.valid) {
      FormUtils.markAsTouched(this.form)

      return
    }

    this.dialogRef.close(this.form.value.serviceType)
  }
}
