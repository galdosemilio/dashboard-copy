import { Component, OnInit, ViewEncapsulation } from '@angular/core'
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  ValidationErrors,
  ValidatorFn,
  Validators
} from '@angular/forms'
import { resolveConfig } from '@app/config/section'
import {
  ContextService,
  EventsService,
  MeasurementLabelService,
  NotifierService,
  SelectedOrganization
} from '@app/service'
import { _ } from '@app/shared'
import { CcrMagnitudeEntry } from '@app/shared/components/magnitude-input'
import { MatDialog } from '@coachcare/material'
import {
  AccountProvider,
  convertFromReadableFormat,
  convertToReadableFormat,
  convertUnitToPreferenceFormat,
  MeasurementDataPointProvider,
  MeasurementDataPointType,
  MeasurementDataPointTypeAssociation,
  MeasurementLabelEntry
} from '@coachcare/sdk'
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy'
import * as moment from 'moment'
import { Subject } from 'rxjs'
import { DATA_TYPE_INPUT_PROPS } from './model'
import { AddDaysheetDialog, AddNoteDialog } from '../../dialogs'
import { debounceTime } from 'rxjs/operators'
import { TranslateService } from '@ngx-translate/core'

@UntilDestroy()
@Component({
  selector: 'app-rightpanel-measurements-v2',
  templateUrl: './add-measurements.component.html',
  styleUrls: ['./add-measurements.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AddMeasurementsV2Component implements OnInit {
  public dataTypeInputProps = DATA_TYPE_INPUT_PROPS
  public hiddenMeasurementTabs: string[] = []
  public labels: MeasurementLabelEntry[] = []
  public labelsForm: FormGroup
  public magnitudes: CcrMagnitudeEntry[] = [
    {
      id: '1',
      displayName: _('GLOBAL.MINUTES'),
      magnitude: 60
    },
    {
      id: '2',
      displayName: _('UNIT.HOURS'),
      magnitude: 360
    }
  ]
  public measurementForm: FormArray
  public notesRefresh$: Subject<string> = new Subject<string>()
  public oldForm: FormGroup
  public shouldShowDaysheetButton: boolean
  public shouldShowTimezoneNotice: boolean
  public typesAssoc: MeasurementDataPointTypeAssociation[]

  private maxAddAttempts = 60
  private notesFormId: string

  constructor(
    private account: AccountProvider,
    private bus: EventsService,
    private context: ContextService,
    private dataPoint: MeasurementDataPointProvider,
    private dialog: MatDialog,
    private fb: FormBuilder,
    private measurementLabel: MeasurementLabelService,
    private notifier: NotifierService,
    private translate: TranslateService
  ) {
    this.dataTypeDependencyValidator = this.dataTypeDependencyValidator.bind(
      this
    )
  }

  public ngOnInit(): void {
    this.createLabelsForm()
    this.createOldForm()
    void this.resolveLabels()

    this.context.organization$
      .pipe(untilDestroyed(this))
      .subscribe((organization) => {
        this.notesFormId = resolveConfig(
          'RIGHT_PANEL.REMINDERS_FORM',
          organization
        )

        const shouldShowDaysheetButton = resolveConfig(
          'RIGHT_PANEL.SHOW_DAYSHEET_BUTTON',
          organization
        )
        this.shouldShowDaysheetButton = !!shouldShowDaysheetButton

        void this.resolveLabels()
        this.resolveHiddenMeasurementTabs(organization)
      })

    this.context.account$.pipe(untilDestroyed(this)).subscribe(async (acc) => {
      try {
        const accData = await this.account.getSingle(acc.id)
        this.shouldShowTimezoneNotice =
          this.context.user.timezone !== accData.timezone
        this.resolveHiddenMeasurementTabs(this.context.organization)
      } catch (error) {
        this.notifier.error(error)
      }
    })
  }

  public getMeasurementPreferenceUnit(type: MeasurementDataPointType): string {
    return convertUnitToPreferenceFormat(
      type,
      this.context.user.measurementPreference,
      this.translate.currentLang
    )
  }

  public getWeightProportion(controlIndex: number): string {
    const weightTypeAssoc = this.typesAssoc.find(
      (assoc) => assoc.type.id === '1'
    )
    const weightTypeIndex = this.typesAssoc.findIndex(
      (assoc) => assoc.type.id === '1'
    )
    const percentageValue = this.measurementForm.value[controlIndex]
    const weightValue = this.measurementForm.value[weightTypeIndex]

    if (!weightValue) {
      return
    }

    return `${(weightValue * (percentageValue / 100)).toFixed(
      1
    )} ${convertUnitToPreferenceFormat(
      weightTypeAssoc.type,
      this.context.user.measurementPreference,
      this.translate.currentLang
    )}`
  }

  public async onSubmit(): Promise<void> {
    this.processWithNewFramework()
  }

  public showDaysheetDialog(): void {
    this.dialog.open(AddDaysheetDialog, {
      width: '400px',
      disableClose: true
    })
  }

  public showNoteDialog(): void {
    const dialog = this.dialog.open(AddNoteDialog, {
      width: '530px',
      disableClose: true,
      data: {
        accountType: 'dieter',
        formId: this.notesFormId
      }
    })

    dialog.afterClosed().subscribe((submissionId) => {
      this.notesRefresh$.next(submissionId)
    })
  }

  private createLabelsForm(): void {
    this.labelsForm = this.fb.group({
      label: [],
      date: [moment(), Validators.required]
    })

    this.labelsForm.valueChanges
      .pipe(untilDestroyed(this))
      .subscribe(async (controls) => {
        const foundLabel = this.labels?.find((lab) => lab.id === controls.label)

        if (!foundLabel) {
          return
        }

        void this.refreshTypes(foundLabel)
      })
  }

  private createOldForm(): void {
    this.oldForm = this.fb.group({
      energy: []
    })

    this.oldForm.valueChanges.subscribe((value) => {
      if (this.oldForm.invalid) {
        return
      }
    })
  }

  private createMeasurementForm(types: MeasurementDataPointType[]): void {
    this.measurementForm = this.fb.array(
      types.map((type) => {
        const control = new FormControl('', [
          Validators.min(
            Math.round(
              convertToReadableFormat(
                type.bound.lower,
                type,
                this.context.user.measurementPreference
              )
            )
          ),
          Validators.max(
            Math.round(
              convertToReadableFormat(
                type.bound.upper,
                type,
                this.context.user.measurementPreference
              )
            )
          ),
          this.dataTypeDependencyValidator(type.id)
        ])

        if (
          Object.values(DATA_TYPE_INPUT_PROPS).some((inputProps) =>
            inputProps.dependsOn.includes(type.id)
          )
        ) {
          control.valueChanges
            .pipe(debounceTime(250), untilDestroyed(this))
            .subscribe(() =>
              this.measurementForm.controls.forEach((ctrl) =>
                ctrl.updateValueAndValidity()
              )
            )
        }

        return control
      })
    )
  }

  private convertFormValue(values: number[]): number[] {
    return values.map((value, idx) =>
      value
        ? convertFromReadableFormat(
            value,
            this.typesAssoc[idx].type,
            this.context.user.measurementPreference
          )
        : 0
    )
  }

  private dataTypeDependencyValidator(typeId: string): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (control.value === null || control.value === '') {
        return null
      }

      const deps = this.dataTypeInputProps[typeId]?.dependsOn ?? null

      if (!deps) {
        return null
      }

      const formValue: Array<string | number> = this.measurementForm.value
      const missingDependency = deps.find((dep) => {
        const formIndex = this.typesAssoc.findIndex(
          (assoc) => assoc.type.id === dep
        )

        return formIndex !== -1
          ? formValue[formIndex] === null || formValue[formIndex] === ''
          : true
      })

      if (missingDependency) {
        const typeAssoc = this.typesAssoc.find(
          (typeAssocEntry) => typeAssocEntry.type.id === missingDependency
        )
        return { [`dependencyError`]: typeAssoc.type.name ?? null }
      }

      return null
    }
  }

  private async processWithNewFramework(): Promise<void> {
    try {
      const formValue = this.measurementForm.value
      const convertedFormValue = this.convertFormValue(formValue)
      let date: moment.Moment = moment(this.labelsForm.value.date.toISOString())
      const now = moment()
      const usesUpsert = this.typesAssoc.some(
        (typeAssoc) => typeAssoc.type.span.id === '2'
      )

      let savedMeasurement: boolean
      let attempts
      let error: string

      if (date.isBefore(now, 'day')) {
        attempts = 0
        date.set('hour', 23)
        date.set('minute', 59)
        date.set('second', 0)
      } else {
        attempts = this.maxAddAttempts
        date = now
      }

      do {
        try {
          error = ''
          const payload = {
            account: this.context.accountId,
            dataPoints: this.typesAssoc
              .map((typeAssoc, idx) =>
                convertedFormValue[idx]
                  ? {
                      type: typeAssoc.type.id,
                      value: convertedFormValue[idx]
                    }
                  : null
              )
              .filter((dataPoint) => dataPoint !== null),
            recordedAt: date.toISOString(),
            source: '3'
          }

          if (usesUpsert) {
            await this.dataPoint.upsertGroupDataPoint(payload)
          } else {
            await this.dataPoint.createGroup(payload)
          }

          savedMeasurement = true
        } catch (err) {
          error = err
          date = date.clone().add(1, 'second')
        } finally {
          ++attempts
        }
      } while (!savedMeasurement && attempts < this.maxAddAttempts)

      if (error) {
        throw new Error(error)
      }

      this.notifier.success(_('NOTIFY.SUCCESS.MEASUREMENT_ADDED'))
      this.bus.trigger('dieter.measurement.refresh')
      this.resetForm()
    } catch (error) {
      this.notifier.error(error)
    }
  }

  private async refreshTypes(label: MeasurementLabelEntry): Promise<void> {
    try {
      this.typesAssoc = await this.measurementLabel.resolveLabelDataPointTypes(
        label
      )

      this.createMeasurementForm(this.typesAssoc.map((assoc) => assoc.type))
    } catch (error) {
      this.notifier.error(error)
    }
  }

  private resolveHiddenMeasurementTabs(organization: SelectedOrganization) {
    this.hiddenMeasurementTabs =
      resolveConfig('JOURNAL.HIDDEN_MEASUREMENT_TABS', organization) || []
  }

  private resetForm(): void {
    this.oldForm.reset()

    const label = this.labelsForm.value.label
    this.labelsForm.reset({ date: moment(), label })
  }

  private async resolveLabels(): Promise<void> {
    try {
      this.labels = await this.measurementLabel.fetchMeasurementLabels()

      if (!this.labels.length) {
        return
      }

      this.labelsForm.patchValue({ label: this.labels[0].id })
    } catch (error) {
      this.notifier.error(error)
    }
  }
}
