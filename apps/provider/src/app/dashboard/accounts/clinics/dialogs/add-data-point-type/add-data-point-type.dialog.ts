import { Component, Inject, OnInit } from '@angular/core'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { ContextService, NotifierService } from '@app/service'
import { _ } from '@app/shared'
import { MatDialogRef, MAT_DIALOG_DATA } from '@coachcare/material'
import {
  convertToReadableFormat,
  convertUnitToPreferenceFormat,
  MeasurementPreferenceProvider
} from '@coachcare/sdk'
import {
  MeasurementDataPointMinimalType,
  MeasurementDataPointTypeProvider
} from '@coachcare/sdk'
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy'
import { MeasurementLabelTableEntry } from '../../services'

export interface AddDataPointTypeDialogProps {
  hasMeasurementPreference: boolean
  measurementLabels: MeasurementLabelTableEntry[]
  unavailableDataPointTypes: MeasurementDataPointMinimalType[]
}

@UntilDestroy()
@Component({
  selector: 'app-data-point-type-dialog',
  templateUrl: './add-data-point-type.dialog.html',
  styleUrls: ['./add-data-point-type.dialog.scss'],
  host: { class: 'ccr-dialog' }
})
export class AddDataPointTypeDialog implements OnInit {
  public dataPointTypes: MeasurementDataPointMinimalType[] = []
  public form: FormGroup
  public selectedDataPointType?: MeasurementDataPointMinimalType

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: AddDataPointTypeDialogProps,
    private context: ContextService,
    private dataPointType: MeasurementDataPointTypeProvider,
    private dialogRef: MatDialogRef<AddDataPointTypeDialog>,
    private fb: FormBuilder,
    private measurementPreference: MeasurementPreferenceProvider,
    private notifier: NotifierService
  ) {}

  public ngOnInit(): void {
    this.createForm()
    void this.fetchDataPointTypes()

    if (!this.data.measurementLabels.length) {
      return
    }

    this.form.patchValue({ label: this.data.measurementLabels[0].id })
  }

  public convertUnitToReadableFormat(
    type: MeasurementDataPointMinimalType
  ): string {
    return convertUnitToPreferenceFormat(
      type,
      this.context.user.measurementPreference
    )
  }

  public convertValueToReadableFormat(
    quantity: number,
    type: MeasurementDataPointMinimalType
  ): number {
    return convertToReadableFormat(
      quantity,
      type,
      this.context.user.measurementPreference
    )
  }

  public async onSubmit(): Promise<void> {
    try {
      const formValue = this.form.value

      if (!this.data.hasMeasurementPreference) {
        await this.measurementPreference.create({
          organization: this.context.clinic.id,
          descendantTypeManagementEnabled: false
        })
      }

      await this.dataPointType.createAssociation({
        organization: this.context.clinic.id,
        type: formValue.dataPointType,
        label: formValue.label
      })

      this.notifier.success(_('NOTIFY.SUCCESS.DATA_POINT_TYPE_ASSOC_CREATED'))

      this.dialogRef.close(true)
    } catch (error) {
      this.notifier.error(error)
    }
  }

  private createForm(): void {
    this.form = this.fb.group({
      label: ['', Validators.required],
      dataPointType: ['', Validators.required]
    })

    this.form
      .get('dataPointType')
      .valueChanges.pipe(untilDestroyed(this))
      .subscribe((typeId) => {
        this.selectedDataPointType =
          this.dataPointTypes.find((type) => type.id === typeId) ?? null
      })
  }

  private async fetchDataPointTypes(): Promise<void> {
    try {
      const dataPointTypes = await this.dataPointType.getAll({ limit: 'all' })
      this.dataPointTypes = dataPointTypes.data.filter(
        (dataPointType) =>
          !this.data.unavailableDataPointTypes?.some(
            (entry) => entry.id === dataPointType.id
          )
      )

      this.form.patchValue({ dataPointType: this.dataPointTypes[0].id })
      this.selectedDataPointType = this.dataPointTypes[0]
    } catch (error) {
      this.notifier.error(error)
    }
  }
}
