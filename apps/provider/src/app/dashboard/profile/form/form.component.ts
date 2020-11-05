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
import { CurrentAccount } from '@app/service'
import { FormUtils, MEASUREMENT_UNITS } from '@app/shared'
import { ccrPhoneValidator } from '@app/shared/components/phone-input'
import { AccUpdateRequest, TimezoneResponse } from '@coachcare/npm-api'
import { select, Store } from '@ngrx/store'
import { LangChangeEvent, TranslateService } from '@ngx-translate/core'
import { untilDestroyed } from 'ngx-take-until-destroy'
import { BehaviorSubject } from 'rxjs'
import { Timezone } from '@coachcare/npm-api'

@Component({
  selector: 'account-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss']
})
export class FormComponent implements OnInit, OnDestroy {
  _data = new BehaviorSubject<CurrentAccount>(null)
  form: FormGroup
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
  onProfileSaved: EventEmitter<AccUpdateRequest> = new EventEmitter<
    AccUpdateRequest
  >()

  timezones: Array<TimezoneResponse> = this.timezone.fetch()
  units = MEASUREMENT_UNITS

  constructor(
    private builder: FormBuilder,
    private responsive: Store<UIResponsiveState>,
    private translator: TranslateService,
    private timezone: Timezone,
    private formUtils: FormUtils
  ) {}

  ngOnInit() {
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
      id: null,
      firstName: '',
      lastName: '',
      phone: [null, [ccrPhoneValidator]],
      email: '',
      timezone: 'America/New_York',
      measurementPreference: null,
      preferredLocales: []
    })
  }

  populateFields(): void {
    this.form.patchValue({
      ...this.profile,
      phone: {
        phone: this.profile.phone,
        countryCode: this.profile.countryCode
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
}
