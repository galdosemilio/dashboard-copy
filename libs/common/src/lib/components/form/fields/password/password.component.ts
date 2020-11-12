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
  FormBuilder,
  FormControl,
  FormGroup,
  NG_VALIDATORS,
  NG_VALUE_ACCESSOR
} from '@angular/forms'
import { _ } from '@coachcare/common/shared'

@Component({
  selector: 'ccr-form-field-password',
  styleUrls: ['./password.component.scss'],
  templateUrl: './password.component.html',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => PasswordFormFieldComponent),
      multi: true
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => PasswordFormFieldComponent),
      multi: true
    }
  ],
  // tslint:disable-next-line:use-host-property-decorator
  host: {
    class: 'mat-form-field',
    '[class.mat-input-invalid]': '_control.invalid && _control.touched',
    '[class.mat-form-field-invalid]': '_control.invalid && _control.touched',
    '[class.mat-form-field-disabled]': '_control.disabled'
  }
})
export class PasswordFormFieldComponent
  implements ControlValueAccessor, OnInit {
  form: FormGroup

  @Input() formControlName: string
  @Input() layout: string
  @Input() minLength = 8

  @Input() disabled: any
  @Input() placeholder: string
  @Input() readonly: any
  @Input() required: any

  @Output() change = new EventEmitter<string>()

  _control: AbstractControl

  hasMinLength = false
  hasNoSequences = false
  oneUppercaseLetter = false
  oneLowercaseLetter = false
  oneNumber = false
  oneSpecialChar = false
  passwordMatch = false

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
    private builder: FormBuilder
  ) {}

  ngOnInit() {
    const parent = this.parent.control as AbstractControl
    this._control = parent.get(this.formControlName) as AbstractControl

    this.form = this.builder.group({
      password: '',
      confirm: ''
    })
  }

  propagateChange = (data: any) => {}
  propagateTouch = () => {}

  onChange() {
    const value = (this.form.get('password') as FormControl).value
    this.propagateChange(value)
    this.change.emit(value)
  }

  /**
   * Control Value Accessor Methods
   */
  writeValue(value: string): void {
    // do nothing
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

  validate() {
    const password = (this.form.get('password') as FormControl).value
    const confirm = (this.form.get('confirm') as FormControl).value

    this.oneLowercaseLetter = password.match('(?=.*[a-z])')
    this.oneUppercaseLetter = password.match('(?=.*[A-Z])')
    this.oneNumber = password.match('(?=.*[0-9])')
    this.oneSpecialChar = password.match('(?=.*[^a-zA-Z0-9])')
    this.hasNoSequences = password.length > 2 && !password.match(/(.)\1{2,}/)
    this.hasMinLength = this.minLength
      ? password.length >= this.minLength
      : true
    this.passwordMatch = password ? password === confirm : false

    if (!this.oneLowercaseLetter) {
      return { message: _('NOTIFY.PASSWORD.ONE_LOWERCASE_LETTER') }
    } else if (!this.oneUppercaseLetter) {
      return { message: _('NOTIFY.PASSWORD.ONE_UPPERCASE_LETTER') }
    } else if (!this.oneNumber) {
      return { message: _('NOTIFY.PASSWORD.ONE_NUMBER') }
    } else if (!this.oneSpecialChar) {
      return { message: _('NOTIFY.PASSWORD.ONE_SPECIAL_CHARACTER') }
    } else if (!this.hasNoSequences) {
      return { message: _('NOTIFY.PASSWORD.HAS_NO_SEQUENCES') }
    } else if (!this.hasMinLength) {
      return { message: _('NOTIFY.PASSWORD.MIN_LENGTH') }
    } else if (!this.passwordMatch) {
      return { message: _('NOTIFY.PASSWORD.BOTH_MATCH') }
    }

    return null
  }
}
