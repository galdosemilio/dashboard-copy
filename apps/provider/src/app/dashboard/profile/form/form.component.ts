import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output
} from '@angular/core'
import { FormBuilder, FormGroup } from '@angular/forms'
import { responsiveSelector, UIResponsiveState } from '@app/layout/store'
import { ContextService, CurrentAccount } from '@app/service'
import { FormUtils, MEASUREMENT_UNITS } from '@app/shared'
import { ccrPhoneValidator } from '@app/shared/components/phone-input'
import { AccUpdateRequest, Gender, TimezoneResponse } from '@coachcare/sdk'
import { select, Store } from '@ngrx/store'
import { LangChangeEvent, TranslateService } from '@ngx-translate/core'
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy'
import { BehaviorSubject } from 'rxjs'
import { Timezone } from '@coachcare/sdk'
import { UserMeasurementPreferenceType } from '@coachcare/sdk/dist/lib/providers/user/requests/userMeasurementPreference.type'
import * as moment from 'moment'

export interface AccountFormProps {
  birthday: moment.Moment
  id: string
  firstName: string
  lastName: string
  phone: { phone: string; countryCode: string }
  email: string
  gender: Gender
  height: number
  timezone: string
  measurementPreference: UserMeasurementPreferenceType
  preferredLocales: string[]
}

@UntilDestroy()
@Component({
  selector: 'account-form',
  templateUrl: './form.component.html'
})
export class FormComponent implements OnInit, OnDestroy {
  _data = new BehaviorSubject<CurrentAccount>(null)
  form: FormGroup
  public isProvider = false
  public isPatient = false
  lang: String
  colSpan = 2
  rowSpan = false

  @Input()
  set profile(value) {
    this._data.next(value)
  }

  get profile() {
    return this._data.getValue()
  }

  @Output()
  onProfileSaved: EventEmitter<AccUpdateRequest> = new EventEmitter<AccUpdateRequest>()

  @Output()
  onDelete?: EventEmitter<void> = new EventEmitter<void>()

  timezones: Array<TimezoneResponse> = this.timezone.fetch()
  units = MEASUREMENT_UNITS

  constructor(
    private builder: FormBuilder,
    private context: ContextService,
    private responsive: Store<UIResponsiveState>,
    private translator: TranslateService,
    private timezone: Timezone,
    private formUtils: FormUtils
  ) {}

  ngOnInit() {
    this.isProvider = this.context.isProvider
    this.isPatient = this.context.isPatient

    // setup the FormGroup
    this.createForm()

    this._data.subscribe((x) => {
      if (this.profile) {
        this.populateFields()
      }
    })

    // get the current lang
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
  }

  ngOnDestroy() {}

  createForm() {
    this.form = this.builder.group({
      birthday: '',
      id: null,
      firstName: '',
      lastName: '',
      phone: [null, [ccrPhoneValidator]],
      email: '',
      gender: '',
      height: '',
      timezone: 'America/New_York',
      measurementPreference: null,
      preferredLocales: []
    })
  }

  populateFields(): void {
    this.form.patchValue({
      ...this.profile,
      ...(this.profile.profile ? this.profile.profile : {}),
      birthday: this.profile.profile?.birthday
        ? moment(this.profile.profile.birthday)
        : null,
      phone: {
        phone: this.profile.phone,
        countryCode: this.profile.countryCode ?? '+1'
      }
    })
  }

  onSubmit() {
    if (this.form.valid) {
      const data: AccUpdateRequest = this.form.value
      this.onProfileSaved.next(data)
    } else {
      this.formUtils.markAsTouched(this.form)
    }
  }

  onDeleteAccount() {
    this.onDelete.next()
  }
}
