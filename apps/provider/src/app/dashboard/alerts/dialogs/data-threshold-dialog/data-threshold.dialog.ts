import { Component, Inject, ViewEncapsulation } from '@angular/core'
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms'
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog'
import { ContextService, NotifierService } from '@app/service'
import { ALERT_REFRESH_TIME_PERIODS, SelectOption } from '@app/shared'
import { _ } from '@app/shared/utils'
import { TypeGroupEntry } from '@app/shared/components/chart-v2'
import {
  AlertPreference,
  Alerts,
  AlertsDataPointMissingOptions,
  AlertsDataPointThresholdOptions,
  AlertTypeId,
  convertFromReadableFormat,
  convertToReadableFormat,
  convertUnitToPreferenceFormat,
  MeasurementDataPointType,
  MeasurementDataPointTypeAssociation
} from '@coachcare/sdk'
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy'
import { concatMap, filter } from 'rxjs/operators'
import { AlertTypesPreference } from '../../services'
import { from } from 'rxjs'
import { AppState } from '@app/store/state'
import { Store } from '@ngrx/store'
import { selectMeasLabelFeature } from '@app/store/measurement-label'
import { ExtendedMeasurementLabelEntry } from '@app/shared/model/measurements'
import { TranslateService } from '@ngx-translate/core'

type AlertDataThresholdDialogMode = 'create' | 'edit'

interface AlertDataThresholdDialogProps {
  preference: AlertTypesPreference
  mode: AlertDataThresholdDialogMode
}

@UntilDestroy()
@Component({
  selector: 'app-alert-data-threshold-dialog',
  templateUrl: './data-threshold.dialog.html',
  styleUrls: ['./data-threshold.dialog.scss'],
  host: { class: 'ccr-dialog ccr-dialog-v2' },
  encapsulation: ViewEncapsulation.None
})
export class AlertDataThresholdDialog {
  public readonly alertTypeOptions: SelectOption<string>[] = [
    {
      value: AlertTypeId.DATA_POINT_THRESHOLD,
      viewValue: _('ALERTS.TYPES.DATA_THRESHOLD_ALERT')
    },
    {
      value: AlertTypeId.DATA_POINT_MISSING,
      viewValue: _('ALERTS.TYPES.MISSING_DATA_ALERT')
    }
  ]
  public form: FormGroup
  public isLoading: boolean
  public missingDataRefreshTimePeriods: SelectOption<string>[] = []
  public mode: AlertDataThresholdDialogMode
  public typeGroups?: TypeGroupEntry[]
  public readonly refreshTimePeriods: SelectOption<string>[] =
    ALERT_REFRESH_TIME_PERIODS
  public selectedDataType?: MeasurementDataPointType
  public selectedDataTypeUnit?: string

  /**
   * Contains a definition of the Alert Preference
   * as if it was an entry from the server.
   *
   * We need it to generate the hint at the bottom of the dialog.
   * */
  private currentAlertPreference?: Partial<AlertPreference>
  private allDataPointTypes: MeasurementDataPointType[] = []

  constructor(
    private alerts: Alerts,
    private context: ContextService,
    @Inject(MAT_DIALOG_DATA) private data: AlertDataThresholdDialogProps,
    private dialogRef: MatDialogRef<AlertDataThresholdDialog>,
    private fb: FormBuilder,
    private notifier: NotifierService,
    private store: Store<AppState>,
    private translateService: TranslateService
  ) {
    this.patchForm = this.patchForm.bind(this)
    this.resolveTypeGroups = this.resolveTypeGroups.bind(this)
    this.validateMagnitudeField = this.validateMagnitudeField.bind(this)
  }

  public ngOnInit(): void {
    this.mode = this.data.mode ?? 'create'

    void this.createMissDataRefreshTimePeriods()
    this.createForm()

    this.store
      .select(selectMeasLabelFeature)
      .pipe(
        untilDestroyed(this),
        filter(
          ({ dataPointTypes, measurementLabels }) =>
            dataPointTypes.length > 0 && measurementLabels.length > 0
        ),
        concatMap(({ dataPointTypes, measurementLabels }) =>
          from(this.resolveTypeGroups(measurementLabels, dataPointTypes))
        ),
        filter(() => this.mode === 'edit')
      )
      .subscribe(this.patchForm)
  }

  public closeDialog(triggerRefresh = false): void {
    this.dialogRef.close(triggerRefresh)
  }

  public async submit(): Promise<void> {
    try {
      this.isLoading = true

      if (this.data.mode === 'create') {
        await this.createPreference()
        this.notifier.success(_('NOTIFY.SUCCESS.ALERT_CREATED'))
      } else {
        await this.updatePreference()
        this.notifier.success(_('NOTIFY.SUCCESS.ALERT_UPDATED'))
      }

      this.closeDialog(true)
    } catch (error) {
      this.notifier.error(error)
    } finally {
      this.isLoading = false
    }
  }

  private createForm(): void {
    this.form = this.fb.group(
      {
        type: [
          this.alertTypeOptions[0].value,
          this.mode === 'create' ? Validators.required : []
        ],
        dataType: ['', Validators.required],
        refreshPeriod: ['', Validators.required],
        isBelow: [false],
        isAbove: [false],
        aboveMagnitude: ['', [this.validateMagnitudeField]],
        belowMagnitude: ['', [this.validateMagnitudeField]]
      },
      { validators: [this.validateForm] }
    )

    this.form
      .get('type')
      .valueChanges.pipe(untilDestroyed(this))
      .subscribe((type) => {
        this.currentAlertPreference = null

        /**
         * We default to the first time period of the array
         * if when the type change occurs, we don't have the
         * currently-selected period as a valid option.
         *
         */
        const isValidOption =
          type === AlertTypeId.DATA_POINT_THRESHOLD
            ? ALERT_REFRESH_TIME_PERIODS.some(
                (option) => option.value === this.form.value.refreshPeriod
              )
            : this.missingDataRefreshTimePeriods.some(
                (option) => option.value === this.form.value.refreshPeriod
              )

        if (isValidOption) {
          return
        }

        this.form
          .get('refreshPeriod')
          .setValue(
            type === AlertTypeId.DATA_POINT_THRESHOLD
              ? ALERT_REFRESH_TIME_PERIODS[0].value
              : this.missingDataRefreshTimePeriods[0].value
          )
      })

    this.form
      .get('dataType')
      .valueChanges.pipe(untilDestroyed(this))
      .subscribe((typeId) => {
        this.selectedDataType = this.allDataPointTypes.find(
          (type) => type.id === typeId
        )

        if (!this.selectedDataType) {
          return
        }

        this.selectedDataTypeUnit = convertUnitToPreferenceFormat(
          this.selectedDataType,
          this.context.user.measurementPreference
        )

        this.form.get('aboveMagnitude').updateValueAndValidity()
        this.form.get('belowMagnitude').updateValueAndValidity()
      })

    this.form
      .get('isAbove')
      .valueChanges.pipe(
        untilDestroyed(this),
        filter((enabled) => enabled)
      )
      .subscribe(() => {
        this.form.patchValue({ isBelow: false })
        this.form.get('belowMagnitude').reset()
        this.form.get('belowMagnitude').disable()
        this.form.get('aboveMagnitude').enable()
      })

    this.form
      .get('isBelow')
      .valueChanges.pipe(
        untilDestroyed(this),
        filter((enabled) => enabled)
      )
      .subscribe(() => {
        this.form.patchValue({ isAbove: false })
        this.form.get('aboveMagnitude').reset()
        this.form.get('aboveMagnitude').disable()
        this.form.get('belowMagnitude').enable()
      })

    this.form.valueChanges
      .pipe(
        untilDestroyed(this),
        filter(() => this.form.valid)
      )
      .subscribe((controls) => {
        const value: number = controls.isAbove
          ? controls.aboveMagnitude
          : controls.belowMagnitude

        const existingPref = this.data.preference ?? null

        this.currentAlertPreference = {
          id: existingPref?.value.id ?? null,
          organization: {
            id: this.context.organization.id,
            preference: {
              options: {
                analysis: { period: controls.refreshPeriod },
                dataPoint: {
                  value,
                  type: { id: controls.dataType }
                },
                direction: controls.isAbove ? 'above' : 'below'
              } as AlertsDataPointThresholdOptions,
              isActive:
                existingPref?.value.organization.preference.isActive ?? true
            }
          },
          type: existingPref?.value.type ?? { id: controls.type }
        }
      })

    this.form.get('belowMagnitude').disable()
    this.form.get('aboveMagnitude').disable()
  }

  private async createPreference(): Promise<void> {
    const formValue = this.form.value

    const createPayload =
      formValue.type === AlertTypeId.DATA_POINT_THRESHOLD
        ? {
            organization: this.context.organizationId,
            alertType: formValue.type,
            preference: {
              options: {
                analysis: { period: formValue.refreshPeriod },
                dataPoint: {
                  type: { id: formValue.dataType },
                  value: convertFromReadableFormat(
                    formValue.isAbove
                      ? formValue.aboveMagnitude
                      : formValue.belowMagnitude,
                    this.selectedDataType,
                    this.context.user.measurementPreference
                  )
                },
                direction: formValue.isAbove ? 'above' : 'below'
              } as AlertsDataPointThresholdOptions,
              isActive: true
            }
          }
        : {
            organization: this.context.organizationId,
            alertType: formValue.type,
            preference: {
              options: {
                analysis: { period: formValue.refreshPeriod },
                dataPoint: {
                  type: { id: formValue.dataType }
                }
              } as AlertsDataPointMissingOptions,
              isActive: true
            }
          }

    await this.alerts.createOrgAlertPreference(createPayload)
  }

  private async createMissDataRefreshTimePeriods(): Promise<void> {
    const translations = await this.translateService
      .get(['GLOBAL.DAY', 'UNIT.DAYS'])
      .toPromise()

    this.missingDataRefreshTimePeriods = new Array(30)
      .fill(0)
      .map((_day, index) => ({
        value: `${index + 1} ${index === 0 ? 'day' : 'days'}`,
        viewValue: `${index + 1} ${
          index === 0 ? translations['GLOBAL.DAY'] : translations['UNIT.DAYS']
        }`.toLowerCase()
      }))
  }

  private patchForm(): void {
    const value = this.data.preference.value as AlertPreference
    const prefOptions = value.organization.preference
      .options as AlertsDataPointThresholdOptions
    const prefDirection = prefOptions.direction

    this.form.patchValue({
      dataType: prefOptions.dataPoint.type.id,
      type: value.type.id
    })

    this.form.updateValueAndValidity()

    const convertedValue = +convertToReadableFormat(
      prefOptions.dataPoint.value,
      this.selectedDataType,
      this.context.user.measurementPreference
    ).toFixed(2)

    this.form.patchValue({
      refreshPeriod: prefOptions.analysis.period,
      aboveMagnitude: convertedValue,
      belowMagnitude: convertedValue
    })

    this.form
      .get(prefDirection === 'above' ? 'isAbove' : 'isBelow')
      .setValue(true)

    this.form.get('type').disable()
  }

  private async resolveTypeGroups(
    labels: ExtendedMeasurementLabelEntry[],
    dataPointTypeAssocs: MeasurementDataPointTypeAssociation[]
  ): Promise<void> {
    try {
      const alertDataPointAssocs = dataPointTypeAssocs.filter(
        (assoc) => assoc.type.alertSelection?.enabled
      )

      this.allDataPointTypes = alertDataPointAssocs.map(
        (association) => association.type
      )

      this.typeGroups = labels
        .map((label) => ({
          id: label.id,
          name: label.name,
          types: alertDataPointAssocs
            .filter((typeEntry) => typeEntry.label.id === label.id)
            .map((typeEntry) => typeEntry.type)
        }))
        .filter((typeGroup) => typeGroup.types.length > 0)

      const firstDataTypeId = this.typeGroups[0]?.types[0]?.id ?? null

      if (firstDataTypeId) {
        this.selectedDataType = this.allDataPointTypes.find(
          (dataType) => dataType.id === firstDataTypeId
        )
      }

      this.form.patchValue({
        dataType: firstDataTypeId,
        refreshPeriod: this.refreshTimePeriods[0].value
      })
    } catch (error) {
      this.notifier.error(error)
    }
  }

  private async updatePreference(): Promise<void> {
    const formValue = this.form.getRawValue()

    const updatePayload =
      formValue.type === AlertTypeId.DATA_POINT_THRESHOLD
        ? {
            id: this.currentAlertPreference.id,
            preference: {
              options: {
                analysis: { period: formValue.refreshPeriod },
                dataPoint: {
                  type: { id: formValue.dataType },
                  value: convertFromReadableFormat(
                    formValue.isAbove
                      ? formValue.aboveMagnitude
                      : formValue.belowMagnitude,
                    this.selectedDataType,
                    this.context.user.measurementPreference
                  )
                },
                direction: formValue.isAbove ? 'above' : 'below'
              } as AlertsDataPointThresholdOptions,
              isActive:
                this.currentAlertPreference.organization.preference.isActive
            }
          }
        : {
            id: this.currentAlertPreference.id,
            preference: {
              options: {
                analysis: { period: formValue.refreshPeriod },
                dataPoint: {
                  type: { id: formValue.dataType }
                }
              } as AlertsDataPointMissingOptions,
              isActive:
                this.currentAlertPreference.organization.preference.isActive
            }
          }

    await this.alerts.updateOrgAlertPreference(updatePayload)
  }

  private validateForm(form: FormGroup): { missingDataError: boolean } | null {
    const formValue = form.getRawValue()
    const isValid =
      formValue.type === AlertTypeId.DATA_POINT_MISSING ||
      (formValue.isBelow && formValue.belowMagnitude) ||
      (formValue.isAbove && formValue.aboveMagnitude)

    return isValid ? null : { missingDataError: true }
  }

  private validateMagnitudeField(
    control: FormControl
  ): { min: boolean } | { max: boolean } | null {
    if (
      !this.selectedDataType ||
      this.form.get('type').value === AlertTypeId.DATA_POINT_MISSING
    ) {
      return null
    }

    const realValue = convertFromReadableFormat(
      control.value ?? 0,
      this.selectedDataType,
      this.context.user.measurementPreference
    )

    if (realValue < this.selectedDataType.bound.lower) {
      return { min: true }
    }

    if (realValue >= this.selectedDataType.bound.upper) {
      return { max: true }
    }

    return null
  }
}
