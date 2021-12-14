import {
  Component,
  forwardRef,
  OnDestroy,
  OnInit,
  ViewEncapsulation
} from '@angular/core'
import {
  ControlValueAccessor,
  FormBuilder,
  FormControl,
  FormGroup,
  NG_VALIDATORS,
  NG_VALUE_ACCESSOR
} from '@angular/forms'
import { NotifierService } from '@app/service'
import { CountryCode } from '@coachcare/sdk'
import { TranslateService } from '@ngx-translate/core'
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy'
import { CountryProvider } from '@coachcare/sdk'

export function ccrPhoneValidator(control: FormControl) {
  const value = control.value || {}
  return !value.countryCode || !value.phone || value.phone.length < 6
    ? { invalidPhone: true }
    : null
}

@UntilDestroy()
@Component({
  selector: 'ccr-phone-input',
  templateUrl: './phone-input.component.html',
  styleUrls: ['./phone-input.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => PhoneInputComponent),
      multi: true
    },
    { provide: NG_VALIDATORS, useValue: ccrPhoneValidator, multi: true }
  ],
  encapsulation: ViewEncapsulation.None
})
export class PhoneInputComponent
  implements ControlValueAccessor, OnDestroy, OnInit {
  countryCodes: CountryCode[] = []
  currentCodeDisplay: { label: string; flagIcon: string }
  currentLang: string
  form: FormGroup
  propagateChange = (_: any) => {}

  private firstCountries: string[] = ['US/CA', 'GB', 'AU', 'NZ', 'IE', 'IL']

  constructor(
    private country: CountryProvider,
    private fb: FormBuilder,
    private notify: NotifierService,
    private translate: TranslateService
  ) {}

  ngOnDestroy(): void {}

  ngOnInit(): void {
    void this.resolveCountryCodes()
    this.createForm()
    this.listenToLangChanges()
  }

  registerOnChange(fn): void {
    this.propagateChange = fn
  }

  registerOnTouched(): void {}

  writeValue(value: any): void {
    if (value) {
      this.form.patchValue(value)
    }
  }

  private createForm(): void {
    this.form = this.fb.group({
      countryCode: [''],
      phone: ['']
    })

    this.form.controls.countryCode.valueChanges
      .pipe(untilDestroyed(this))
      .subscribe((code) => {
        const currentCode = this.countryCodes.find(
          (countryCode) => countryCode.code === code
        )

        if (currentCode) {
          this.currentCodeDisplay = {
            label: `${currentCode.locale} (${currentCode.code})`,
            flagIcon: currentCode.flagIcon
          }
        } else {
          this.form.controls.countryCode.patchValue('+1')
        }
      })

    this.form.valueChanges
      .pipe(untilDestroyed(this))
      .subscribe((controls) => this.propagateChange(controls))

    this.form.patchValue({ countryCode: '+1' })
  }

  private listenToLangChanges(): void {
    this.currentLang = this.translate.currentLang.split('-')[0].toLowerCase()
    this.translate.onLangChange
      .pipe(untilDestroyed(this))
      .subscribe((langChangeEvent) => {
        this.currentLang = langChangeEvent.lang.split('-')[0].toLowerCase()
      })
  }

  private async resolveCountryCodes() {
    try {
      const localCountries = this.country.getAllCountryPhoneCodes({
        firstCountries: this.firstCountries
      })
      this.countryCodes = localCountries
    } catch (error) {
      this.notify.error(error)
    }
  }
}
