import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core'
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormGroup,
  Validators
} from '@angular/forms'
import { MatDialog } from '@coachcare/common/material'
import { resolveConfig } from '@app/config/section'
import { MeasurementsDataService } from '@app/layout/right-panel/services'
import {
  ContextService,
  EventsService,
  NotifierService,
  SelectedOrganization
} from '@app/service'
import { _, FormUtils, getInputFactor, unitConversion } from '@app/shared'
import {
  AccountMeasurementPreferenceType,
  AddActivityRequest,
  AddBodyMeasurementRequest,
  AddManualSleepMeasurementRequest
} from '@coachcare/npm-api'
import { Moment } from '@coachcare/ccr-datepicker'
import * as moment from 'moment-timezone'
import { untilDestroyed } from 'ngx-take-until-destroy'
import { Subject } from 'rxjs'
import { AccountProvider } from '@coachcare/npm-api'
import { AddDaysheetDialog, AddNoteDialog } from '../../dialogs'

@Component({
  selector: 'add-rightpanel-measurements',
  templateUrl: './add-measurements.component.html',
  styleUrls: ['./add-measurements.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AddMeasurementsComponent implements OnInit, OnDestroy {
  public get circumference(): FormArray {
    return this.form.get('circumference') as FormArray
  }

  public get composition(): FormArray {
    return this.form.get('composition') as FormArray
  }

  public get energy(): FormArray {
    return this.form.get('energy') as FormArray
  }

  public get vitals(): FormArray {
    return this.form.get('vitals') as FormArray
  }

  public filteredFields: string[] = []
  public form: FormGroup
  public hiddenMeasurementTabs: string[] = []
  public measurementType = 'circumference'
  public notesRefresh$: Subject<string> = new Subject<string>()
  public recordedDate: moment.Moment = moment()
  public shouldShowDaysheetButton: boolean
  public shouldShowTimezoneNotice: boolean
  public measurementPreference: AccountMeasurementPreferenceType

  private maxAddAttempts = 60
  private notesFormId: string

  constructor(
    public formUtils: FormUtils,
    private account: AccountProvider,
    private builder: FormBuilder,
    private bus: EventsService,
    private context: ContextService,
    private dataService: MeasurementsDataService,
    private dialog: MatDialog,
    private notifier: NotifierService
  ) {}

  public ngOnInit(): void {
    this.measurementPreference = this.context.user.measurementPreference
    this.initForm({ value: this.measurementType })
    this.bus.register(
      'add-measurement.section.change',
      this.sectionChanged.bind(this)
    )
    this.context.organization$
      .pipe(untilDestroyed(this))
      .subscribe((organization: SelectedOrganization) => {
        this.filteredFields = resolveConfig(
          'JOURNAL.HIDDEN_COMPOSITION_COLUMNS',
          organization
        )
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
      } catch (error) {
        this.notifier.error(error)
      }
    })
    this.resolveHiddenMeasurementTabs(this.context.organization)
  }

  public ngOnDestroy(): void {
    this.bus.unregister('add-measurement.section.change')
  }

  public initForm(formType: { value: string }): void {
    this.form = this.builder.group({
      recordedAt: this.recordedDate,
      circumference: this.builder.array([]),
      composition: this.builder.array([]),
      energy: this.builder.array([]),
      vitals: this.builder.array([])
    })
    ;(this.form.controls[formType.value] as FormArray).push(
      this.formFields(formType.value)
    )
    this.form
      .get('recordedAt')
      .valueChanges.pipe(untilDestroyed(this))
      .subscribe((date) => {
        this.recordedAtChanged(date)
      })
  }

  public onCompositionChange(field): void {
    const weight = this.form.get('composition.0.weight').value

    const calcBodyFat = () => {
      const lbs = this.form.get('composition.0.bodyFatLbs').value
      const value = weight > 0 ? (lbs * 100) / weight : 0
      this.form.get('composition.0.bodyFat').setValue(value.toFixed(1))
    }
    const calcBodyFatLbs = () => {
      const perc = this.form.get('composition.0.bodyFat').value
      this.form
        .get('composition.0.bodyFatLbs')
        .setValue(((weight * perc) / 100).toFixed())
    }
    const diffBodyFat = () => {
      const mass = this.form.get('composition.0.leanMass').value
      this.form.get('composition.0.bodyFat').setValue((100 - mass).toFixed(1))
    }
    const calcVisceralFat = () => {
      const lbs = this.form.get('composition.0.visceralFatLbs').value
      const value = weight > 0 ? (lbs * 100) / weight : 0
      this.form.get('composition.0.visceralFat').setValue(value.toFixed(1))
    }
    const calcVisceralFatLbs = () => {
      const perc = this.form.get('composition.0.visceralFat').value
      const value = (weight * perc) / 100
      this.form.get('composition.0.visceralFatLbs').setValue(value.toFixed())
    }
    const calcWaterPercentage = () => {
      const lbs = this.form.get('composition.0.waterLbs').value
      const value = weight > 0 ? (lbs * 100) / weight : 0
      this.form.get('composition.0.waterPercentage').setValue(value.toFixed())
    }
    const calcWaterLbs = () => {
      const perc = this.form.get('composition.0.waterPercentage').value
      this.form
        .get('composition.0.waterLbs')
        .setValue(((weight * perc) / 100).toFixed())
    }

    switch (field) {
      case 'weight':
        calcBodyFat()
        calcBodyFatLbs()
        calcWaterPercentage()
        calcVisceralFat()
        calcVisceralFatLbs()
        break
      case 'bodyFat':
        calcBodyFatLbs()
        break
      case 'bodyFatLbs':
        calcBodyFat()
        break
      case 'leanMass':
        diffBodyFat()
        calcBodyFatLbs()
        break
      case 'leanMassLbs':
        diffBodyFat()
        calcBodyFatLbs()
        break
      case 'visceralFat':
        calcVisceralFatLbs()
        break
      case 'visceralFatLbs':
        calcVisceralFat()
        break
      case 'waterPercentage':
        calcWaterLbs()
        break
      case 'waterLbs':
        calcWaterPercentage()
        break
    }
  }

  public async onSubmit(): Promise<void> {
    if (this.form.valid && this.form.dirty) {
      const data = this.form.value
      const formData = Object.assign(data, data[this.measurementType][0])
      const recordedAt = moment(formData.recordedAt)
      delete formData.circumference
      delete formData.composition
      delete formData.energy
      delete formData.vitals

      formData.clientId = this.context.accountId
      formData.device = 3
      formData.recordedAt = recordedAt.isBefore(moment(), 'day')
        ? recordedAt.endOf('day').subtract(59, 'seconds').format()
        : recordedAt.isAfter(moment(), 'day')
        ? recordedAt.startOf('day').format()
        : recordedAt.format()

      switch (this.measurementType) {
        case 'energy':
          this.addSteps(formData)
          this.addSleep(formData)
          break

        default:
          const pref = this.context.user.measurementPreference
          // composition
          const comFactor = getInputFactor(pref, 'composition')
          if (formData.weight && Number(formData.weight) > 0) {
            formData.weight = (formData.weight * comFactor).toFixed()
          } else {
            delete formData.weight
          }
          if (formData.bodyFat && Number(formData.bodyFat) > 0) {
            formData.bodyFat = (formData.bodyFat * 1000).toFixed()
          } else {
            delete formData.bodyFat
          }
          if (formData.visceralFat && Number(formData.visceralFat) > 0) {
            formData.visceralFatPercentage = (
              formData.visceralFat * 1000
            ).toFixed()
          } else {
            delete formData.visceralFat
          }
          if (
            formData.waterPercentage &&
            Number(formData.waterPercentage) > 0
          ) {
            formData.waterPercentage = (
              formData.waterPercentage * 1000
            ).toFixed()
          } else {
            delete formData.waterPercentage
          }
          if (
            formData.visceralFatTanita &&
            Number(formData.visceralFatTanita) > 0
          ) {
            formData.visceralFatTanita = Number(
              formData.visceralFatTanita
            ).toFixed()
          } else {
            delete formData.visceralFatTanita
          }
          if (formData.ketones && Number(formData.ketones) > 0) {
            formData.ketones = Number(formData.ketones * 1000).toFixed()
          }
          if (
            formData.visceralAdiposeTissue &&
            Number(formData.visceralAdiposeTissue) > 0
          ) {
            formData.visceralAdiposeTissue = Number(
              formData.visceralAdiposeTissue * 1000
            ).toFixed()
          }
          // circumference
          const cirFactor = getInputFactor(pref, 'circumference')
          if (formData.waist) {
            formData.waist = (formData.waist * cirFactor).toFixed()
          }
          if (formData.arm) {
            formData.arm = (formData.arm * cirFactor).toFixed()
          }
          if (formData.chest) {
            formData.chest = (formData.chest * cirFactor).toFixed()
          }
          if (formData.hip) {
            formData.hip = (formData.hip * cirFactor).toFixed()
          }
          if (formData.thigh) {
            formData.thigh = (formData.thigh * cirFactor).toFixed()
          }
          if (formData.neck) {
            formData.neck = (formData.neck * cirFactor).toFixed()
          }
          if (formData.thorax) {
            formData.thorax = (formData.thorax * cirFactor).toFixed()
          }
          if (formData.temperature) {
            formData.temperature = unitConversion(
              this.measurementPreference,
              'temperature-push',
              formData.temperature,
              3
            )
            formData.temperature = (formData.temperature * 100).toFixed()
          }
          // vitals
          if (formData.hba1c) {
            formData.hba1c = (formData.hba1c * 1000).toFixed()
          }
          if (formData.hsCrp) {
            formData.hsCrp = (formData.hsCrp * 10000).toFixed()
          }

          delete formData.bodyFatLbs
          delete formData.leanMass
          delete formData.leanMassLbs
          delete formData.visceralFat
          delete formData.visceralFatLbs
          delete formData.waterLbs

          let addBodyMeasurementRequst: AddBodyMeasurementRequest = formData
          addBodyMeasurementRequst = this.formUtils.pruneEmpty(formData)
          addBodyMeasurementRequst.account = Number(this.context.account.id)
          let savedMeasurement: boolean
          let attempts: number = recordedAt.isBefore(moment(), 'day')
            ? 0
            : this.maxAddAttempts
          let error: string

          do {
            try {
              error = ''
              await this.attemptToAddMeasurement(addBodyMeasurementRequst)
              savedMeasurement = true

              // TODO proper responses when available in api
              this.notifier.success(_('NOTIFY.SUCCESS.MEASUREMENT_ADDED'))
              this.bus.trigger('dieter.measurement.refresh')
              this.resetForm()
            } catch (err) {
              error = err
              addBodyMeasurementRequst.recordedAt = moment(
                addBodyMeasurementRequst.recordedAt
              )
                .add(1, 'second')
                .format()
            } finally {
              ++attempts
            }
          } while (!savedMeasurement && attempts < this.maxAddAttempts)

          if (error) {
            this.notifier.error(error)
          }
      }
    }
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

  public sleepEndTimeChange(e): void {
    this.checkTimeDifference()
  }

  public sleepStartTimeChange(e): void {
    const startTime = this.form.get('energy.0.sleepStartTime').value
    const currentDate = moment(this.form.get('recordedAt').value)
    this.form.get('energy.0.sleepStartTime').setValue(
      startTime.set({
        dayOfYear: currentDate.get('dayOfYear'),
        year: currentDate.get('year')
      })
    )
    if (!this.form.get('energy.0.sleepEndTime').value) {
      this.form
        .get('energy.0.sleepEndTime')
        .setValue(moment(startTime).add({ hours: 8 }))
    }
    this.checkTimeDifference()
  }

  private addSteps(formData): void {
    if (formData.steps) {
      const activity = [
        {
          date: formData.recordedAt,
          steps: formData.steps,
          device: 3
        }
      ]
      const addActivityRequst: AddActivityRequest = {
        activity: activity,
        clientId: this.context.accountId
      }
      this.dataService
        .addActivityData(addActivityRequst)
        .then((res) => {
          // TODO proper responses when available in api
          this.notifier.success(_('NOTIFY.SUCCESS.STEPS_ADDED'))
          this.bus.trigger('dieter.measurement.refresh')
          this.resetForm()
        })
        .catch((err) => this.notifier.error(err))
    }
  }

  private addSleep(formData): void {
    if (!formData.sleepStartTime || !formData.sleepEndTime) {
      return
    }

    const addManualSleepMeasurementRequest: AddManualSleepMeasurementRequest = {
      clientId: this.context.accountId,
      deviceId: 3,
      startTime: moment(formData.sleepStartTime).format(),
      endTime: moment(formData.sleepEndTime).format(),
      quality: 64
    }
    this.dataService
      .addSleepData(addManualSleepMeasurementRequest)
      .then((res) => {
        // TODO proper responses when available in api
        this.notifier.success(_('NOTIFY.SUCCESS.SLEEP_ADDED'))
        this.bus.trigger('dieter.measurement.refresh')
        this.resetForm()
      })
      .catch((err) => this.notifier.error(err))
  }

  private async attemptToAddMeasurement(
    addBodyMeasurementRequest: AddBodyMeasurementRequest
  ): Promise<string> {
    try {
      await this.dataService.addBodyMeasurementData(addBodyMeasurementRequest)
      return
    } catch (error) {
      return Promise.reject(error)
    }
  }

  private checkTimeDifference(): void {
    const start = this.form.get('energy.0.sleepStartTime').value
    const end = this.form.get('energy.0.sleepEndTime').value
    if (start && end) {
      if (end.diff(start, 'hour', true) <= 0) {
        this.notifier.error(_('NOTIFY.ERROR.START_MUSTBE_BEFORE'))
        this.form
          .get('energy.0.sleepStartTime')
          .setValue(moment(end).subtract(8, 'hours'))
      }
      if (end.diff(start, 'hour', true) > 24) {
        this.notifier.error(_('NOTIFY.ERROR.SLEEP_LESSTHAN_24H'))
        this.form
          .get('energy.0.sleepEndTime')
          .setValue(moment(start).add(24, 'hours'))
      }
    }
  }

  private formFields(formType: string): FormGroup {
    switch (formType) {
      default:
      case 'circumference':
        return this.builder.group(
          {
            waist: [null, Validators.max(200)],
            arm: [null, Validators.max(200)],
            chest: [null, Validators.max(200)],
            hip: [null, Validators.max(200)],
            thigh: [null, Validators.max(200)],
            neck: [null, Validators.max(200)],
            thorax: [null, Validators.max(200)]
          },
          {
            validator: this.validateCircumference
          }
        )

      case 'composition':
        return this.builder.group(
          {
            weight: [null, Validators.min(1)],
            bodyFat: [null, Validators.max(100)],
            bodyFatLbs: null,
            leanMass: [null, Validators.max(100)],
            leanMassLbs: null,
            waterPercentage: [null, Validators.max(100)],
            waterLbs: null,
            visceralAdiposeTissue: null,
            visceralFat: [null, Validators.max(100)],
            visceralFatLbs: null,
            visceralFatTanita: null,
            ketones: null
          },
          {
            validator: this.validateComposition
          }
        )

      case 'energy':
        return this.builder.group(
          {
            steps: null,
            sleepStartTime: null,
            sleepEndTime: null
          },
          {
            validator: this.validateEnergy
          }
        )

      case 'vitals':
        return this.builder.group(
          {
            totalCholesterol: [null, Validators.max(20000)],
            ldl: [null, Validators.max(15000)],
            hdl: [null, Validators.max(15000)],
            vldl: [null, Validators.max(15000)],
            triglycerides: [null, Validators.max(32767)],
            fastingGlucose: [null, Validators.max(7500)],
            hba1c: [null, Validators.max(100)],
            insulin: [null, Validators.max(4000)],
            hsCrp: [null, Validators.max(350)],
            temperature: [null, Validators.max(115)],
            heartRate: [null, Validators.max(650)],
            bloodPressureSystolic: [null, Validators.max(500)],
            bloodPressureDiastolic: [null, Validators.max(500)],
            respirationRate: [null, Validators.max(400)]
          },
          {
            validator: this.validateVitals
          }
        )
    }
  }

  private recordedAtChanged(date: Moment): void {
    switch (this.measurementType) {
      case 'energy':
        const sleepStart = this.form.get('energy.0.sleepStartTime').value
        const sleepEnd = this.form.get('energy.0.sleepEndTime').value
        if (sleepStart) {
          const currentStartTime = moment(sleepStart)
          const currentEndTime = moment(sleepEnd)
          const diff = Math.abs(
            currentEndTime.diff(currentStartTime, 'minutes')
          )
          currentStartTime.set({
            dayOfYear: date.get('dayOfYear'),
            year: date.get('year')
          })

          if (sleepEnd) {
            this.form
              .get('energy.0.sleepEndTime')
              .patchValue(moment(currentStartTime).add(diff, 'minutes'))
          }

          this.form.get('energy.0.sleepStartTime').patchValue(currentStartTime)
          this.checkTimeDifference()
        }
        break
    }
  }

  private resetForm(): void {
    this.recordedDate = moment()
    this.initForm({ value: this.measurementType })
  }

  private resolveHiddenMeasurementTabs(organization: SelectedOrganization) {
    this.hiddenMeasurementTabs =
      resolveConfig('JOURNAL.HIDDEN_MEASUREMENT_TABS', organization) || []
  }

  private sectionChanged(section): void {
    // temporary fix to stop food from trying to create its form
    if (!this.form.dirty && section.value !== 'food') {
      this.measurementType = section.value
      this.initForm(section)
    }
  }

  private validateCircumference(control: AbstractControl): any {
    const waist = control.get('waist')
    const arm = control.get('arm')
    const chest = control.get('chest')
    const hip = control.get('hip')
    const thigh = control.get('thigh')
    const neck = control.get('neck')
    const thorax = control.get('thorax')

    if (
      waist.value ||
      arm.value ||
      chest.value ||
      hip.value ||
      thigh.value ||
      neck.value ||
      thorax.value
    ) {
      return null
    } else {
      return control.touched || control.dirty
        ? { validateCircumference: true }
        : null
    }
  }

  private validateComposition(control: AbstractControl): any {
    const weight = Number(control.get('weight').value)
    const bodyfat = Number(control.get('bodyFat').value)
    const hydration = Number(control.get('waterPercentage').value)
    const ketones = Number(control.get('ketones').value)

    if (weight > 0 || bodyfat > 0 || hydration > 0 || ketones > 0) {
      return null
    } else {
      return control.touched || control.dirty
        ? { validateComposition: true }
        : null
    }
  }

  private validateEnergy(control: AbstractControl): any {
    const steps = control.get('steps')
    const sleepStartTime = control.get('sleepStartTime')
    const sleepEndTime = control.get('sleepEndTime')

    if (sleepEndTime.value || sleepStartTime.value) {
      if (sleepEndTime.value && sleepStartTime.value) {
        return null
      } else {
        return { validateSleepTimes: _('NOTIFY.ERROR.BOTH_SLEEP_TIMES') }
      }
    } else if (steps.value) {
      return null
    } else {
      return control.touched || control.dirty ? { validateEnergy: false } : null
    }
  }

  private validateVitals(control: AbstractControl): any {
    const totalCholesterol = control.get('totalCholesterol')
    const ldl = control.get('ldl')
    const hdl = control.get('hdl')
    const vldl = control.get('vldl')
    const triglycerides = control.get('triglycerides')
    const fastingGlucose = control.get('fastingGlucose')
    const hba1c = control.get('hba1c')
    const insulin = control.get('insulin')
    const hsCrp = control.get('hsCrp')
    const temperature = control.get('temperature')
    const respirationRate = control.get('respirationRate')
    const heartRate = control.get('heartRate')
    const bloodPressureDiastolic = control.get('bloodPressureDiastolic')
    const bloodPressureSystolic = control.get('bloodPressureSystolic')

    if (
      totalCholesterol.value ||
      ldl.value ||
      hdl.value ||
      vldl.value ||
      triglycerides.value ||
      fastingGlucose.value ||
      hba1c.value ||
      insulin.value ||
      hsCrp.value ||
      temperature.value ||
      respirationRate.value ||
      heartRate.value ||
      bloodPressureDiastolic.value ||
      bloodPressureSystolic.value
    ) {
      if (
        (bloodPressureDiastolic.value
          ? bloodPressureDiastolic.value && bloodPressureSystolic.value
          : true) &&
        (bloodPressureSystolic.value
          ? bloodPressureDiastolic.value && bloodPressureSystolic.value
          : true)
      ) {
        return null
      } else {
        return { validateBloodPressure: true }
      }
    } else {
      return { validateVitals: true }
    }
  }
}
