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
import { SelectorOption } from '@coachcare/common/shared'
import { LanguageService } from '@coachcare/common/services/language.service'
import { LOCALES } from '@coachcare/common/shared'
import { differenceWith, isEqual } from 'lodash'

@Component({
  selector: 'ccr-form-field-lang',
  templateUrl: './lang-selector.component.html',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => LangFormFieldComponent),
      multi: true
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => LangFormFieldComponent),
      multi: true
    }
  ],
  // tslint:disable-next-line:use-host-property-decorator
  host: {
    class: 'mat-form-field',
    '[class.mat-input-invalid]': '_control?.invalid && _control?.touched',
    '[class.mat-form-field-invalid]': '_control?.invalid && _control?.touched',
    '[class.mat-form-field-disabled]': '_control?.disabled'
  }
})
export class LangFormFieldComponent implements ControlValueAccessor, OnInit {
  @Input() formControlName: string
  @Input() getArray = true

  @Input() disabled: any
  @Input() placeholder: string
  @Input() readonly: any
  @Input() required: any

  @Output() change = new EventEmitter<any>()

  _control: AbstractControl | undefined
  selected: any
  options: Array<SelectorOption>

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
    private language: LanguageService,
    @Optional()
    @Host()
    @SkipSelf()
    private parent: ControlContainer
  ) {}

  ngOnInit() {
    if (this.formControlName) {
      const parent = this.parent.control as AbstractControl
      this._control = parent.get(this.formControlName) as AbstractControl
    }

    this.options = differenceWith(
      LOCALES,
      this.language.localesBlacklist,
      (viewValue, value) => viewValue.code === value
    ).map((locale) => ({
      value: locale.code,
      viewValue: `${locale.nativeName} (${locale.country})`
    }))
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
  writeValue(value: any): void {
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
        return { ccrFieldLang: true }
      }
    }
    return null
  }

  compareWith(a: any, b: any) {
    return isEqual(a, b)
  }
}
