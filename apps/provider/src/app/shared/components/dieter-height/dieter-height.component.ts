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
  ViewEncapsulation
} from '@angular/core'
import {
  AbstractControl,
  ControlContainer,
  ControlValueAccessor,
  FormBuilder,
  FormControl,
  FormGroup,
  NG_VALIDATORS,
  NG_VALUE_ACCESSOR
} from '@angular/forms'
import { MAT_LABEL_GLOBAL_OPTIONS } from '@coachcare/common/material'
import { ContextService } from '@app/service'
import { AccountMeasurementPreferenceType } from '@coachcare/npm-api'
import { FEETS } from '@app/shared/utils/units'

@Component({
  selector: 'ccr-form-field-height',
  templateUrl: './dieter-height.component.html',
  styleUrls: ['./dieter-height.component.scss'],
  encapsulation: ViewEncapsulation.None,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => HeightFormFieldComponent),
      multi: true
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => HeightFormFieldComponent),
      multi: true
    },
    { provide: MAT_LABEL_GLOBAL_OPTIONS, useValue: { float: 'always' } }
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
export class HeightFormFieldComponent implements ControlValueAccessor, OnInit {
  form: FormGroup

  @Input()
  formControlName: string

  @Input()
  disabled: any
  @Input()
  placeholder: string
  @Input()
  readonly: any
  @Input()
  required: any

  @Output()
  change = new EventEmitter<number>()

  _control: AbstractControl | undefined
  value: number

  preference: AccountMeasurementPreferenceType
  feets = [3, 4, 5, 6, 7]
  inches = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]

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
    private builder: FormBuilder,
    private context: ContextService
  ) {
    this.preference = this.context.user.measurementPreference
  }

  ngOnInit() {
    if (this.formControlName) {
      const parent = this.parent.control as AbstractControl
      this._control = parent.get(this.formControlName) as AbstractControl
    }

    this.form = this.builder.group({
      cm: '',
      ft: '',
      in: ''
    })

    this.form.valueChanges.subscribe((values) => {
      switch (this.preference) {
        case 'metric':
          this.onChange(Number(values.cm))
          break
        default:
          // height unit conversion to cm
          const v = Math.round(
            (Number(values.ft) * 12 + Number(values.in)) * 2.54
          )
          this.onChange(v)
      }
    })
  }

  propagateChange = (data: any) => {}
  propagateTouch = () => {}

  onChange(value: number) {
    this.value = value
    this.propagateChange(this.value)
    this.change.emit(this.value)
  }

  /**
   * Control Value Accessor Methods
   */
  writeValue(value: number): void {
    if (value) {
      this.value = value
      switch (this.preference) {
        case 'metric':
          this.form.patchValue({ cm: value })
          break
        default:
          // height unit conversion from cm to feet
          let height = value * FEETS * 10
          let feet = Math.floor(height)
          height -= feet
          let inches = Math.round(height * 12)
          if (inches === 12) {
            feet++
            inches = 0
          }
          this.form.patchValue({ ft: feet, in: inches })
      }
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
        return { ccrFieldHeight: 'required' }
      }
    }
    return null
  }
}
