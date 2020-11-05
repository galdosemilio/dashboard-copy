import {
  ChangeDetectorRef,
  Component,
  forwardRef,
  Input,
  OnDestroy,
  OnInit,
  ViewEncapsulation
} from '@angular/core'
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms'
import { resolveConfig } from '@app/config/section'
import { responsiveSelector, UIResponsiveState } from '@app/layout/store'
import { ContextService, NotifierService } from '@app/service'
import {
  _,
  BindForm,
  BINDFORM_TOKEN,
  getInputFactor,
  sleep,
  unitConversion
} from '@app/shared'
import { PackageSelectorProps } from '@app/shared/components/package-selector/models'
import { Package } from '@app/shared/components/package-table/models/package.model'
import { PackageDatabase } from '@app/shared/components/package-table/services/package.database'
import { ccrPhoneValidator } from '@app/shared/components/phone-input'
import {
  AccountMeasurementPreferenceType,
  AccSingleResponse,
  FetchGoalResponse,
  TimezoneResponse
} from '@coachcare/npm-api'
import { select, Store } from '@ngrx/store'
import { LangChangeEvent, TranslateService } from '@ngx-translate/core'
import { clone } from 'lodash'
import * as moment from 'moment-timezone'
import { untilDestroyed } from 'ngx-take-until-destroy'
import { Subject } from 'rxjs'
import { AccountProvider, Goal, Timezone } from '@coachcare/npm-api'
import { AccountIdentifiersProps } from './account-identifiers/models'

@Component({
  selector: 'app-dieter-form',
  templateUrl: './dieter.component.html',
  styleUrls: ['./dieter.component.scss'],
  encapsulation: ViewEncapsulation.None,
  providers: [
    {
      provide: BINDFORM_TOKEN,
      useExisting: forwardRef(() => DieterFormComponent)
    }
  ]
})
export class DieterFormComponent implements BindForm, OnInit, OnDestroy {
  @Input()
  dieterId: number

  datepickerMode: 'datepicker' | 'text' = 'datepicker'
  form: FormGroup
  isLoading = false
  lang: string
  measurement: AccountMeasurementPreferenceType
  colSpan = 2
  rowSpan = false
  maxBirthday = moment().endOf('day')

  genders = [
    { value: 'male', viewValue: _('SELECTOR.GENDER.MALE') },
    { value: 'female', viewValue: _('SELECTOR.GENDER.FEMALE') }
    // { value: 'notspecified', viewValue: _('SELECTOR.GENDER.NOTSPECIFIED') }
  ]
  timezones: Array<TimezoneResponse> = this.timezone.fetch()
  accountIdentifiersArgs: AccountIdentifiersProps = {}
  packageSelectorArgs: PackageSelectorProps = {
    events: {
      forcePackageSelection: new Subject<Package>()
    }
  }
  forcePackageSelection = false
  hasPackages = false
  hasSelectedPackages = false
  showAccountIdentifiersInput = false
  public showUnderageNotice = false

  private minimumPatientAge = 16

  constructor(
    private builder: FormBuilder,
    private cdr: ChangeDetectorRef,
    private context: ContextService,
    private database: PackageDatabase,
    private responsive: Store<UIResponsiveState>,
    private translator: TranslateService,
    private account: AccountProvider,
    private goal: Goal,
    private timezone: Timezone,
    private notifier: NotifierService
  ) {
    this.measurement = this.context.user.measurementPreference || 'us'
    this.minimumAgeConsentValidator = this.minimumAgeConsentValidator.bind(this)
  }

  ngOnInit() {
    // setup the FormGroup
    this.createForm()
    this.subscribeToEvents()

    // set the current language to display the proper timezones
    this.lang = this.translator.currentLang.split('-')[0]
    this.translator.onLangChange.subscribe(
      (event: LangChangeEvent) => (this.lang = event.lang.split('-')[0])
    )
    // setup mat-grid responsiveness
    this.responsive
      .pipe(untilDestroyed(this), select(responsiveSelector))
      .subscribe((state) => {
        this.colSpan = state.colspan
        this.rowSpan = state.rowspan
      })

    if (this.dieterId) {
      this.isLoading = true
      this.loadDieterData()
    } else {
      this.subscribeToClientBirthday()
    }

    this.accountIdentifiersArgs.account = this.dieterId
      ? this.dieterId.toString()
      : ''
    this.showAccountIdentifiersInput =
      this.dieterId ||
      resolveConfig(
        'PATIENT_FORM.SHOW_ACC_IDN_INPUT_CREATE',
        this.context.organization
      )
    this.resolvePackageAmount()
  }

  ngOnDestroy() {}

  createForm() {
    this.form = this.builder.group({
      organization: this.context.organization.name,
      hasMinimumAgeConsent: [false, this.minimumAgeConsentValidator],
      id: this.dieterId,
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', Validators.required],
      password: Math.random().toString(13).substr(2), // TODO the API should do this
      isActive: true,
      timezone: ['America/New_York', Validators.required],
      measurementPreference: this.measurement,
      phone: [null, [ccrPhoneValidator]],
      clientBirthday: [null, Validators.required],
      clientGender: ['', Validators.required],
      clientHeight: ['', Validators.required],
      // startDate: new Date(),
      // weightInitial: '',
      weightGoal: '',
      preferredLocales: ['', Validators.required],
      clientStartedAt: null
    })

    this.form.valueChanges
      .pipe(untilDestroyed(this))
      .subscribe(
        (controls) =>
          (this.hasSelectedPackages =
            controls.packages && controls.packages.length)
      )
  }

  onDatepickerFocus($event: any) {
    if ($event && $event.target) {
      $event.target.select()
    }

    this.datepickerMode = 'text'
  }

  onDatepickerBlur() {
    this.datepickerMode = 'datepicker'
  }

  private loadDieterData(): void {
    Promise.all([
      this.account.getSingle(this.dieterId),
      this.goal.fetch({ account: `${this.dieterId}` })
    ])
      .then(async (res) => {
        const account: AccSingleResponse = res[0]
        const goals: FetchGoalResponse = res[1]

        // override initial values
        this.form.patchValue({
          password: undefined
        })

        // TODO pending start date and initial weight
        this.form.patchValue(
          DieterFormComponent.postRead(account, goals, this.measurement)
        )

        this.isLoading = false

        await sleep(500)

        this.subscribeToClientBirthday()
      })
      .catch((err) => this.notifier.error(err))
  }

  private minimumAgeConsentValidator(control: FormControl): any {
    return this.showUnderageNotice && !control.value
      ? { noUnderageConsent: true }
      : null
  }

  private async resolvePackageAmount(): Promise<void> {
    const response = await this.database
      .fetch({
        organization: this.context.organizationId,
        isActive: true
      })
      .toPromise()

    this.hasPackages = response.data.length > 0
  }

  private subscribeToClientBirthday(): void {
    this.form.controls.clientBirthday.valueChanges
      .pipe(untilDestroyed(this))
      .subscribe((birthday) => {
        if (
          this.isLoading ||
          Math.abs(moment(birthday).diff(moment(), 'years', true)) >=
            this.minimumPatientAge
        ) {
          this.showUnderageNotice = false
          this.form.controls.hasMinimumAgeConsent.setErrors(null)
          return
        }

        this.showUnderageNotice = true

        this.cdr.detectChanges()
      })
  }

  private subscribeToEvents(): void {
    this.packageSelectorArgs.events.forcePackageSelection
      .pipe(untilDestroyed(this))
      .subscribe((force: boolean) => (this.forcePackageSelection = force))
  }

  static postRead(
    acc: AccSingleResponse,
    goals: FetchGoalResponse,
    pref: AccountMeasurementPreferenceType
  ) {
    const account: any = acc
    // process the account data
    Object.keys(account.clientData).forEach((field) => {
      switch (field) {
        case 'birthday':
          account['clientBirthday'] = moment(account.clientData.birthday).utc()
          break
        case 'startedAt':
          account['clientStartedAt'] = moment(
            account.clientData.startedAt
          ).utc()
          break
        default:
          const key = 'client' + field.replace(/\b\w/g, (f) => f.toUpperCase())
          account[key] = account.clientData[field]
      }
    })

    const preferredLocales =
      account.preferredLocales && account.preferredLocales.length
        ? account.preferredLocales
        : ['en']

    account['preferredLocales'] = preferredLocales

    // process the incoming goals
    account['weightGoal'] =
      goals.goal.weight !== null
        ? Math.round(unitConversion(pref, 'composition', goals.goal.weight))
        : 0

    account['phone'] = {
      phone: account.phone,
      countryCode: account.countryCode
    }

    return account
  }

  static preSave(dieterData, pref: AccountMeasurementPreferenceType) {
    // process the account data without mutate the original
    const data = clone(dieterData)
    if (data.clientBirthday) {
      data.clientBirthday = data.clientBirthday.format('YYYY-MM-DD')
    }
    if (data.clientStartedAt) {
      data.clientStartedAt = data.clientStartedAt.toISOString().slice(0, 10)
    }

    // collect the goals
    const goals = []
    if (data.hasOwnProperty('weightGoal')) {
      goals.push({
        goal: 'weight',
        quantity: Math.round(
          data.weightGoal * getInputFactor(pref, 'composition')
        ) // to grams
      })
      delete data.weightGoal
    }

    data.client = {
      birthday: data.clientBirthday,
      height: data.clientHeight,
      gender: data.clientGender,
      startedAt: data.clientStartedAt || undefined
    }
    delete data.clientStartedAt
    delete data.clientBirthday
    delete data.clientGender
    delete data.clientHeight
    delete data.organization

    data.countryCode = data.phone.countryCode
    data.phone = data.phone.phone

    return { data, goals }
  }
}
