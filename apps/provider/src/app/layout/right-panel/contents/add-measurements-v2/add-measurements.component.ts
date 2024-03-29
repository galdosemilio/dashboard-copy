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
  NotifierService,
  SelectedOrganization
} from '@app/service'
import { ExtendedMeasurementLabelEntry, _ } from '@app/shared'
import { CcrMagnitudeEntry } from '@coachcare/common/components'
import { MatDialog } from '@coachcare/material'
import {
  AccountProvider,
  convertFromReadableFormat,
  convertToReadableFormat,
  convertUnitToPreferenceFormat,
  CreateMeasurementDataPointGroup,
  DataPointTypes,
  MeasurementDataPointGroupLabelProvider,
  MeasurementDataPointProvider,
  MeasurementDataPointType,
  MeasurementDataPointTypeAssociation,
  MeasurementLabelEntry,
  MeasurementSource
} from '@coachcare/sdk'
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy'
import * as moment from 'moment'
import { Subject } from 'rxjs'
import { DATA_TYPE_INPUT_PROPS } from './model'
import { AddDaysheetDialog, AddNoteDialog } from '../../dialogs'
import { debounceTime } from 'rxjs/operators'
import { TranslateService } from '@ngx-translate/core'
import {
  MeasurementMetadataProp,
  MEASUREMENT_METADATA_MAP,
  MeasurementPainLabelProp
} from '@app/shared/model/measurementMetadata'
import { chain, intersection, set } from 'lodash'
import { Store } from '@ngrx/store'
import { AppState } from '@app/store/state'
import {
  MeasurementLabelActions,
  selectCurrentLabel,
  selectCurrentLabelTypes,
  selectMeasurementLabels
} from '@app/store/measurement-label'

enum Span {
  INSTANT = '1',
  DATE = '2'
}

interface DataPointTypeAssociationWithIndex {
  index: number
  assoc: MeasurementDataPointTypeAssociation
}

@UntilDestroy()
@Component({
  selector: 'app-rightpanel-measurements-v2',
  templateUrl: './add-measurements.component.html',
  styleUrls: ['./add-measurements.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AddMeasurementsV2Component implements OnInit {
  public isPainIntensity = false
  public isLoading = false
  public dataTypeInputProps = DATA_TYPE_INPUT_PROPS
  public hiddenMeasurementTabs: string[] = []
  public labels: ExtendedMeasurementLabelEntry[] = []
  public labelsForm: FormGroup
  public painLabels: MeasurementPainLabelProp[] = []
  public painManagementId = 1
  public painLabelsForm: FormArray
  public magnitudes: CcrMagnitudeEntry[] = [
    {
      id: '1',
      displayName: _('GLOBAL.MINUTES'),
      magnitude: 1
    },
    {
      id: '2',
      displayName: _('UNIT.HOURS'),
      magnitude: 60
    }
  ]
  public measurementForm: FormArray
  public metadataForm: FormArray
  public metadataEntries: MeasurementMetadataProp[] = []
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
    private dataPointGroupLabel: MeasurementDataPointGroupLabelProvider,
    private dialog: MatDialog,
    private fb: FormBuilder,
    private notifier: NotifierService,
    private store: Store<AppState>,
    private translate: TranslateService
  ) {
    this.dataTypeDependencyValidator =
      this.dataTypeDependencyValidator.bind(this)

    this.refreshLabels = this.refreshLabels.bind(this)
    this.refreshTypes = this.refreshTypes.bind(this)
  }

  public ngOnInit(): void {
    this.createLabelsForm()
    this.createOldForm()

    this.store
      .select(selectMeasurementLabels)
      .pipe(untilDestroyed(this))
      .subscribe(this.refreshLabels)

    this.store
      .select(selectCurrentLabelTypes)
      .pipe(untilDestroyed(this))
      .subscribe(this.refreshTypes)

    this.store
      .select(selectCurrentLabel)
      .pipe(untilDestroyed(this))
      .subscribe((label) =>
        this.labelsForm.patchValue(
          {
            label: (label as MeasurementLabelEntry).id ?? label
          },
          { emitEvent: false }
        )
      )

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
    void this.processWithNewFramework()
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

  private async attemptToAddMeasurement(
    payload: CreateMeasurementDataPointGroup,
    upsert: boolean
  ): Promise<void> {
    let date: moment.Moment = moment(payload.recordedAt)
    const now = moment()

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
        if (upsert) {
          await this.dataPoint.upsertGroupDataPoint({
            ...payload,
            recordedAt: date.toISOString()
          })
        } else {
          await this.dataPoint.createGroup({
            ...payload,
            recordedAt: date.toISOString()
          })
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
  }

  private createLabelsForm(): void {
    this.labelsForm = this.fb.group({
      label: [],
      date: [moment(), Validators.required]
    })

    this.labelsForm
      .get('label')
      .valueChanges.pipe(untilDestroyed(this))
      .subscribe((label) => {
        const foundLabel = this.labels?.find((lab) => lab.id === label)

        if (!foundLabel) {
          return
        }

        this.store.dispatch(
          MeasurementLabelActions.SelectLabel({ label: foundLabel })
        )
      })
  }

  private createOldForm(): void {
    this.oldForm = this.fb.group({
      energy: []
    })

    this.oldForm.valueChanges.subscribe(() => {
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
                type.bound.upper - 1,
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

  private createMetadataForm(metadataProps: MeasurementMetadataProp[]): void {
    this.metadataForm = this.fb.array(
      metadataProps.map(() => new FormControl('', [Validators.required]))
    )
  }

  private async createPainLabelsForm() {
    await this.resolvePainLabels()

    this.painLabelsForm = this.fb.array(
      this.painLabels.map(() => new FormControl(''))
    )

    this.painLabelsForm.valueChanges
      .pipe(untilDestroyed(this))
      .subscribe((values) => {
        const isRequired = values.filter((value) => value).length > 0

        this.painLabelsForm.controls.forEach((ctrl) => {
          ctrl.setValidators(isRequired ? [Validators.required] : [])
          ctrl.updateValueAndValidity({ emitEvent: false })
        })
      })
  }

  private createPayload(
    types: DataPointTypeAssociationWithIndex[],
    formValue,
    metadataFormValue,
    painLabelsFormValue
  ): CreateMeasurementDataPointGroup {
    const date: moment.Moment = moment(this.labelsForm.value.date.toISOString())

    const payload: CreateMeasurementDataPointGroup = {
      account: this.context.accountId,
      dataPoints: types
        .map((typeAssocEntry) =>
          formValue[typeAssocEntry.index]
            ? {
                type: typeAssocEntry.assoc.type.id,
                value: formValue[typeAssocEntry.index]
              }
            : null
        )
        .filter((dataPoint) => dataPoint !== null),
      recordedAt: date.toISOString(),
      source: MeasurementSource.MANUAL
    }

    if (metadataFormValue.length > 0) {
      metadataFormValue.forEach((value, idx) =>
        set(payload, this.metadataEntries[idx].payloadRoute, value)
      )
    }

    if (painLabelsFormValue) {
      payload.labels = painLabelsFormValue
    }

    return payload
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
      this.isLoading = true
      const formValue = this.measurementForm.value
      const metadataFormValue = this.metadataForm.value
      const convertedFormValue = this.convertFormValue(formValue)
      const painLabelsFormValue = this.painLabelsForm?.value

      const { dateTypesAssoc, instantTypesAssoc } = this.typesAssoc.reduce(
        (typesAcc, assoc, index) =>
          assoc.type.span.id === Span.DATE
            ? {
                dateTypesAssoc: [...typesAcc.dateTypesAssoc, { assoc, index }],
                instantTypesAssoc: typesAcc.instantTypesAssoc
              }
            : {
                dateTypesAssoc: typesAcc.dateTypesAssoc,
                instantTypesAssoc: [
                  ...typesAcc.instantTypesAssoc,
                  { assoc, index }
                ]
              },
        {
          dateTypesAssoc: [] as DataPointTypeAssociationWithIndex[],
          instantTypesAssoc: [] as DataPointTypeAssociationWithIndex[]
        }
      )

      const instantPayload = this.createPayload(
        instantTypesAssoc,
        convertedFormValue,
        metadataFormValue,
        painLabelsFormValue
      )
      const datePayload = this.createPayload(
        dateTypesAssoc,
        convertedFormValue,
        metadataFormValue,
        painLabelsFormValue
      )

      if (instantPayload.dataPoints.length) {
        await this.attemptToAddMeasurement(instantPayload, false)
      }

      if (datePayload.dataPoints.length) {
        await this.attemptToAddMeasurement(datePayload, true)
      }

      this.notifier.success(_('NOTIFY.SUCCESS.MEASUREMENT_ADDED'))
      this.bus.trigger('dieter.measurement.refresh')
      this.resetForm()
    } catch (error) {
      this.notifier.error(error)
    } finally {
      this.isLoading = false
    }
  }

  private async resolvePainLabels() {
    if (this.painLabels.length) {
      return
    }

    try {
      this.isLoading = true

      const result: MeasurementPainLabelProp[] = []

      const labelTypesResponse =
        await this.dataPointGroupLabel.getAllLabelTypes({
          category: this.painManagementId,
          limit: 'all',
          status: 'active'
        })

      const labelTypes = labelTypesResponse.data

      for (const labelType of labelTypes) {
        const res = await this.dataPointGroupLabel.getAllLabels({
          type: labelType.id,
          category: this.painManagementId.toString(),
          limit: 'all'
        })

        result.push({
          id: labelType.id,
          name: labelType.name,
          options: res.data.map((entry) => ({
            value: entry.id,
            viewValue: entry.name
          }))
        })
      }

      this.painLabels = result
    } catch (error) {
      this.notifier.error(error)
    } finally {
      this.isLoading = false
    }
  }

  private async refreshTypes(
    types: MeasurementDataPointTypeAssociation[]
  ): Promise<void> {
    try {
      this.typesAssoc = types

      const assocTypes = this.typesAssoc.map((assoc) => assoc.type)
      const assocTypeIds = assocTypes.map((assoc) => assoc.id)

      this.metadataEntries = chain(
        Object.values(MEASUREMENT_METADATA_MAP).filter(
          (mapEntry) =>
            intersection(mapEntry.dataPointTypes, assocTypeIds).length > 0
        )
      )
        .flatMap((mapEntry) => [...mapEntry.properties])
        .value()

      this.isPainIntensity = assocTypeIds.includes(
        DataPointTypes.PAIN_INTENSITY
      )
      this.createMeasurementForm(assocTypes)
      this.createMetadataForm(this.metadataEntries)

      if (this.isPainIntensity) {
        void this.createPainLabelsForm()
      }
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

  private async refreshLabels(
    labels: ExtendedMeasurementLabelEntry[]
  ): Promise<void> {
    try {
      this.labels = labels

      if (!this.labels.length) {
        return
      }

      this.labelsForm.patchValue({ label: this.labels[0].id })
    } catch (error) {
      this.notifier.error(error)
    }
  }
}
