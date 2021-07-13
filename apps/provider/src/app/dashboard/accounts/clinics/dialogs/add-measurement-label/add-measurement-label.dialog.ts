import { Component, Inject, OnInit } from '@angular/core'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { ContextService, NotifierService } from '@app/service'
import { bufferedRequests, _ } from '@app/shared/utils'
import { MatDialogRef, MAT_DIALOG_DATA } from '@coachcare/material'
import { MeasurementLabelProvider } from '@coachcare/sdk'

export interface AddMeasurementLabelDialogProps {
  highestSortOrder: number
}

@Component({
  selector: 'app-clinics-add-measurement-label-dialog',
  templateUrl: './add-measurement-label.dialog.html',
  host: { class: 'ccr-dialog' }
})
export class AddMeasurementLabelDialog implements OnInit {
  public form: FormGroup

  constructor(
    private context: ContextService,
    @Inject(MAT_DIALOG_DATA) public data: AddMeasurementLabelDialogProps,
    private dialog: MatDialogRef<AddMeasurementLabelDialog>,
    private fb: FormBuilder,
    private measurementLabel: MeasurementLabelProvider,
    private notifier: NotifierService
  ) {}

  public ngOnInit(): void {
    this.createForm()
  }

  public async onSubmit(): Promise<void> {
    try {
      const highestSortOrder: number = Math.max(0, this.data.highestSortOrder)
      const formValue = this.form.value.value
      const labelEntity = await this.measurementLabel.create({
        ...formValue,
        organization: this.context.clinic.id,
        description: formValue.description || undefined,
        sortOrder: highestSortOrder + 1
      })

      if (!formValue.translations) {
        this.notifier.success(_('NOTIFY.SUCCESS.MEASUREMENT_LABEL_CREATED'))
        this.dialog.close(true)
        return
      }

      const promises = formValue.translations.map((translation) =>
        this.measurementLabel.upsertLocale({
          id: labelEntity.id,
          locale: translation.language,
          name: translation.name,
          description: translation.description ?? undefined
        })
      )

      await bufferedRequests(promises)

      this.notifier.success(_('NOTIFY.SUCCESS.MEASUREMENT_LABEL_CREATED'))
      this.dialog.close(true)
    } catch (error) {
      this.notifier.error(error)
    }
  }

  private createForm(): void {
    this.form = this.fb.group({
      value: [null, Validators.required]
    })
  }
}
