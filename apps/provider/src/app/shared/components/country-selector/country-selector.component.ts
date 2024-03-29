import {
  Component,
  EventEmitter,
  forwardRef,
  Host,
  Input,
  OnInit,
  Optional,
  Output,
  SkipSelf
} from '@angular/core'
import {
  AbstractControl,
  ControlContainer,
  ControlValueAccessor,
  FormControl,
  NG_VALIDATORS,
  NG_VALUE_ACCESSOR
} from '@angular/forms'
import { resolveConfig } from '@app/config/section'
import { ContextService } from '@app/service'
import { MAIN_REG_COUNTRIES, REG_COUNTRIES } from '@app/shared/model'
import { TranslateService } from '@ngx-translate/core'
import { differenceWith, intersectionWith, map, sortBy } from 'lodash'
import { CountryProvider } from '@coachcare/sdk'

@Component({
  selector: 'ccr-country-selector',
  templateUrl: './country-selector.component.html',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CountrySelectorComponent),
      multi: true
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => CountrySelectorComponent),
      multi: true
    }
  ],
  // eslint-disable-next-line
  host: {
    class: 'mat-form-field',
    '[class.mat-input-invalid]': '_control.invalid && _control.touched',
    '[class.mat-form-field-invalid]': '_control.invalid && _control.touched',
    '[class.mat-form-field-disabled]': '_control.disabled'
  }
})
export class CountrySelectorComponent implements ControlValueAccessor, OnInit {
  @Input() formControlName: string

  @Input() disabled: any
  @Input() placeholder: string
  @Input() readonly: any
  @Input() required: any

  @Output() change = new EventEmitter<any>()

  _control: AbstractControl
  mainOptions: any[] = []
  selected: string
  options: Array<any> = []

  get isDisabled() {
    return this.disabled === '' || this.disabled === true
  }
  get isReadonly() {
    return this.readonly === '' || this.readonly === true
  }
  get isRequired() {
    return this.required === '' || this.required === true
  }

  constructor(
    private context: ContextService,
    private country: CountryProvider,
    @Optional()
    @Host()
    @SkipSelf()
    private parent: ControlContainer,
    private translator: TranslateService
  ) {}

  ngOnInit() {
    const parent = this.parent.control as AbstractControl
    this._control = parent.get(this.formControlName) as AbstractControl
    // fill the translated options
    void this.translate()
    this.translator.onLangChange.subscribe(() => {
      void this.translate()
    })
  }

  async translate() {
    try {
      const response = await this.country.getAll({ limit: 'all', offset: 0 })
      const list = response.data.map((country) => ({
        viewValue: country.name,
        value: country.id
      }))
      const priorityCountry: string[] =
        resolveConfig(
          'REGISTER.INFO.PRIORITY_COUNTRY',
          this.context.organization
        ) || []

      this.mainOptions = intersectionWith(
        list,
        priorityCountry,
        (viewValue, value) => viewValue.value === value
      )

      this.mainOptions.push(
        ...intersectionWith(
          differenceWith(
            MAIN_REG_COUNTRIES,
            priorityCountry,
            (viewValue, value) => viewValue.value === value
          ),
          list,
          (viewValue, value) => viewValue.value === value.value
        )
      )

      this.options = differenceWith(
        list,
        this.mainOptions,
        (viewValue, value) => viewValue.value === value.value
      )
    } catch (error) {
      this.options = []
      const strings = map(REG_COUNTRIES, 'viewValue')
      this.translator.get(strings).subscribe((countries) => {
        const list = REG_COUNTRIES.map((c) => ({
          viewValue: countries[c.viewValue],
          value: c.value
        }))
        this.mainOptions = sortBy(list, 'viewValue')
      })
    }
  }

  propagateChange = (data: any) => {}
  propagateTouch = () => {}

  onChange() {
    this.propagateChange(this.selected)
    this.change.emit(this.selected)
  }

  /**
   * Control Value Accessor Methods
   */
  writeValue(value: string): void {
    if (value) {
      this.selected = value
      this.onChange()
    }
  }

  registerOnChange(fn: any): void {
    this.propagateChange = fn
  }

  registerOnTouched(fn: any): void {
    this.propagateTouch = fn
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled
  }

  validate(c: FormControl) {
    if (!this.isDisabled && this.isRequired) {
      if (!c.value) {
        return { ccrFieldCountry: 'required' }
      }
    }
    return null
  }
}
