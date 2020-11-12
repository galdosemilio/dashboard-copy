import {
  AfterViewInit,
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
import { LanguageService } from '@app/service'
import { LOCALES, SelectOptions } from '@app/shared/utils'
import { isArray, isEqual } from 'lodash'

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
    '[class.mat-form-field-disabled]': '_control?.disabled',
    '[class.mat-form-field-autofilled]': '_control?.autofilled'
  }
})
export class LangFormFieldComponent
  implements ControlValueAccessor, OnInit, AfterViewInit {
  @Input() formControlName: string
  @Input() getArray = true

  @Input() disabled: any
  @Input() placeholder: string
  @Input() readonly: any
  @Input() required: any

  @Output() change = new EventEmitter<any>()

  _control: AbstractControl | undefined
  selected: any
  options: SelectOptions<string>

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
    @Optional()
    @Host()
    @SkipSelf()
    private parent: ControlContainer,
    private language: LanguageService
  ) {}

  ngOnInit() {
    if (this.formControlName) {
      const parent = this.parent.control as AbstractControl
      this._control = parent.get(this.formControlName) as AbstractControl
    }

    this.options = LOCALES.map((locale) => ({
      value: locale.code,
      viewValue: `${locale.nativeName} (${locale.country})`
    }))
  }

  ngAfterViewInit() {
    if (!this.selected) {
      console.log('setting value for select: ', this.language.get())
      this.selected = [this.language.get()]
      this.onChange()
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
  writeValue(value: any): void {
    if (isArray(value) && value.length) {
      this.selected = value.length > 1 ? [value[0]] : value
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
