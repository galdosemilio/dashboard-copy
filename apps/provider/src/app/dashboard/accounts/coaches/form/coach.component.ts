import {
  Component,
  forwardRef,
  HostBinding,
  Input,
  OnDestroy,
  OnInit,
  ViewChild
} from '@angular/core'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import {
  ClinicPickerDataSource,
  ClinicsDatabase,
  ClinicsPickerComponent,
  ClinicsPickerValue
} from '@app/dashboard/accounts/clinics'
import { responsiveSelector, UIResponsiveState } from '@app/layout/store'
import { ContextService, NotifierService } from '@app/service'
import { BindForm, BINDFORM_TOKEN } from '@app/shared'
import { ccrPhoneValidator } from '@app/shared/components/phone-input'
import {
  AccountProvider,
  SecurityProvider,
  Timezone,
  TimezoneResponse
} from '@coachcare/sdk'
import { select, Store } from '@ngrx/store'
import { LangChangeEvent, TranslateService } from '@ngx-translate/core'
import { clone } from 'lodash'
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy'
import { Subject } from 'rxjs'
import * as moment from 'moment'

@UntilDestroy()
@Component({
  selector: 'app-coach-form',
  templateUrl: './coach.component.html',
  styleUrls: ['./coach.component.scss'],
  providers: [
    {
      provide: BINDFORM_TOKEN,
      useExisting: forwardRef(() => CoachFormComponent)
    }
  ]
})
export class CoachFormComponent implements BindForm, OnInit, OnDestroy {
  @Input()
  coachId: number

  @HostBinding('class.ccr-styled')
  @Input()
  styled = false

  @Input() markAsTouched: Subject<void>

  @ViewChild(ClinicsPickerComponent, { static: false })
  picker: ClinicsPickerComponent

  form: FormGroup
  isLoading = false
  isOwnProfile = true
  isEmailRestricted = false
  lang: string
  colSpan = 2

  timezones: Array<TimezoneResponse> = this.timezone.fetch()
  source: ClinicPickerDataSource | null
  static isEmailRestricted = false

  constructor(
    private builder: FormBuilder,
    private responsive: Store<UIResponsiveState>,
    private translator: TranslateService,
    private account: AccountProvider,
    private timezone: Timezone,
    private context: ContextService,
    private notifier: NotifierService,
    private database: ClinicsDatabase,
    private securityProvider: SecurityProvider
  ) {}

  async ngOnInit() {
    this.isOwnProfile = this.coachId === +this.context.user.id

    // setup the clinics table source
    this.source = new ClinicPickerDataSource(this.notifier, this.database)

    // setup the FormGroup
    this.createForm()
    // set the current language to display the proper timezones
    this.lang = this.translator.currentLang.split('-')[0]
    this.translator.onLangChange.subscribe(
      (event: LangChangeEvent) => (this.lang = event.lang.split('-')[0])
    )
    // setup mat-grid responsiveness
    this.responsive
      .pipe(untilDestroyed(this), select(responsiveSelector))
      .subscribe((state) => (this.colSpan = state.colspan))

    if (this.coachId) {
      this.isLoading = true
      await this.loadCoachData()
    }
  }

  ngOnDestroy() {
    this.source.disconnect()
  }

  createForm() {
    this.form = this.builder.group({
      addresses: [[]],
      birthday: '',
      id: this.coachId,
      firstName: '',
      lastName: '',
      email: '',
      gender: '',
      height: '',
      password: Math.random().toString(13).substr(2), // TODO the API should do this
      isActive: true,
      timezone: 'America/New_York',
      measurementPreference: this.context.user.measurementPreference,
      preferredLocales: [],
      phone: [null, [ccrPhoneValidator]],
      clinics: [],
      sendActivationEmail: true
    })
  }

  createAddressForm() {
    return this.builder.group({
      address: [null, Validators.required]
    })
  }

  markAsSubmitted() {
    // this.picker.markAsSubmitted();
  }

  private async loadCoachData(): Promise<void> {
    try {
      const account = await this.account.getSingle(this.coachId)

      // update the form
      this.form.patchValue({
        ...account,
        ...(account.profile ? account.profile : {}),
        birthday: account.profile?.birthday
          ? moment(account.profile.birthday)
          : null,
        password: undefined,
        phone: {
          phone: account.phone,
          countryCode: account.countryCode
        }
      })

      const { data } = await this.securityProvider.ipRestriction()
      if (
        data.some((regex) => {
          const re = new RegExp(regex.email)
          return re.test(account.email)
        })
      ) {
        this.isEmailRestricted = true
        CoachFormComponent.isEmailRestricted = true
      }
      this.isLoading = false
    } catch (error) {
      this.notifier.error(error)
    }
  }

  static preSave(coachData): { data: any; clinics: Array<ClinicsPickerValue> } {
    // process the account data without mutate the original
    const data = clone({
      ...coachData,
      phone: coachData.phone.phone,
      countryCode: coachData.phone.countryCode
    })

    data.profile = {
      gender: data.gender || undefined,
      height: data.height || undefined,
      birthday: data.birthday
        ? (data.birthday as moment.Moment).format('YYYY-MM-DD')
        : undefined
    }

    delete data.gender
    delete data.height
    delete data.birthday

    if (CoachFormComponent.isEmailRestricted) {
      delete data.email
    }

    if (data.sendActivationEmail) {
      delete data.sendActivationEmail
    } else {
      data.sendActivationEmail = 'disabled'
    }

    // collect the clinics data
    const clinics = data.clinics
    delete data.clinics

    if (data.addresses?.length) {
      data.addresses = data.addresses.filter((address) => address)
    }

    return { data, clinics }
  }
}
