import {
  Component,
  EventEmitter,
  forwardRef,
  Host,
  Input,
  OnInit,
  Optional,
  Output,
  SkipSelf,
  ViewChild
} from '@angular/core'
import {
  AbstractControl,
  ControlContainer,
  ControlValueAccessor,
  FormControl,
  NG_VALIDATORS,
  NG_VALUE_ACCESSOR
} from '@angular/forms'
import { MatInput } from '@coachcare/material'

@Component({
  selector: 'ccr-form-field-number',
  templateUrl: './number.component.html',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => NumberFormFieldComponent),
      multi: true
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => NumberFormFieldComponent),
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
export class NumberFormFieldComponent implements ControlValueAccessor, OnInit {
  @Input() formControlName: string
  @Input() prefix: string
  @Input() suffix: string

  @Input() disabled: any
  @Input() placeholder: string
  @Input() readonly: any
  @Input() required: any

  @Output() change = new EventEmitter<any>()

  @ViewChild(MatInput, { static: false })
  _input: MatInput

  _control: AbstractControl | undefined
  value = ''

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

  onChange(value: string) {
    this.value = value
    this.propagateChange(this.value)
    this.change.emit(this.value)
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
    this.propagateChange = (data: any) => {
      fn(data)
      this.updateErrorState()
    }
  }

  registerOnTouched(fn: any): void {
    this.propagateTouch = () => {
      fn()
      this.updateErrorState()
    }
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled
  }

  validate(c: FormControl) {
    if (!this.isDisabled && this.isRequired) {
      if (!c.value) {
        return { ccrFieldNumber: 'required' }
      }
    }
    return null
  }

  private updateErrorState() {
    if (this._control) {
      this._input.errorState = this._control.invalid
      this._input.stateChanges.next()
    }
  }
}
