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
import * as tinycolor from 'tinycolor2'

@Component({
  selector: 'ccr-form-field-color',
  templateUrl: './color.component.html',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ColorFormFieldComponent),
      multi: true
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => ColorFormFieldComponent),
      multi: true
    }
  ],
  // eslint-disable-next-line
  host: {
    class: 'mat-form-field',
    '[class.mat-input-invalid]': '_control?.invalid && _control?.touched',
    '[class.mat-form-field-invalid]': '_control?.invalid && _control?.touched',
    '[class.mat-form-field-disabled]': '_control?.disabled'
  }
})
export class ColorFormFieldComponent implements ControlValueAccessor, OnInit {
  @Input() formControlName: string

  @Input() allowClear: boolean
  @Input() disabled: any
  @Input() placeholder: string
  @Input() readonly: any
  @Input() required: any

  @Output() change = new EventEmitter<string>()

  _control: AbstractControl | undefined
  value = ''
  contrast = ''

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
    private parent: ControlContainer
  ) {}

  ngOnInit() {
    if (this.formControlName) {
      const parent = this.parent.control as AbstractControl
      this._control = parent.get(this.formControlName) as AbstractControl
    }
  }

  propagateChange = (data: any) => {}
  propagateTouch = () => {}

  onChange(value?: string) {
    this.value = value || ''
    this.updateContrast()

    this.propagateChange(this.value || null)
    this.change.emit(this.value)
  }

  updateContrast() {
    const options = {
      includeFallbackColors: true
    }
    // get the most readable black/white
    this.contrast = tinycolor
      .mostReadable(this.value, [this.value], options)
      .toHexString()
  }

  /**
   * Control Value Accessor Methods
   */
  writeValue(value: string): void {
    if (value) {
      this.value = value
      this.onChange(value)
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
    if (this.isRequired && !this.isDisabled) {
      if (!c.value) {
        return { ccrFieldColor: 'required' }
      }
    }
    return null
  }
}
