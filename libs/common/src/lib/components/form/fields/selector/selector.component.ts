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
} from '@angular/core';
import {
  AbstractControl,
  ControlContainer,
  ControlValueAccessor,
  FormControl,
  NG_VALIDATORS,
  NG_VALUE_ACCESSOR
} from '@angular/forms';
import { SelectorOption } from '@coachcare/backend/shared';
import {
  GENDERS,
  MEASUREMENT_UNITS,
  PHONE_TYPES,
  STATUSES
} from '@coachcare/common/shared';
import { SelectorFormFieldTypes } from './types.interface';

@Component({
  selector: 'ccr-form-selector',
  templateUrl: './selector.component.html',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SelectorFormFieldComponent),
      multi: true
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => SelectorFormFieldComponent),
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
export class SelectorFormFieldComponent implements ControlValueAccessor, OnInit {
  @Input() formControlName: string;
  @Input() type: SelectorFormFieldTypes;

  @Input() disabled: any;
  @Input() placeholder: string;
  @Input() readonly: any;
  @Input() required: any;

  @Output() change = new EventEmitter<any>();

  _control: AbstractControl | undefined;
  selected: any;
  options: Array<SelectorOption>;

  get isDisabled() {
    return this.disabled === '' || this.disabled === true;
  }
  get isReadonly() {
    return this.readonly === '' || this.readonly === true;
  }
  get isRequired() {
    return this.required === '' || this.required === true;
  }

  constructor(
    @Optional()
    @Host()
    @SkipSelf()
    private parent: ControlContainer
  ) {}

  ngOnInit() {
    if (this.formControlName) {
      const parent = this.parent.control as AbstractControl;
      this._control = parent.get(this.formControlName) as AbstractControl;
    }

    switch (this.type) {
      case 'gender':
        this.options = GENDERS;
        break;
      case 'measurement':
        this.options = MEASUREMENT_UNITS;
        break;
      case 'phoneType':
        this.options = PHONE_TYPES;
        break;
      case 'status':
        this.options = STATUSES;
        break;

      default:
        throw new Error('A valid "type" must be provided to ccr-form-selector');
    }
  }

  propagateChange = (data: any) => {};
  propagateTouch = () => {};

  onChange() {
    this.propagateChange(this.selected);
    this.change.emit(this.selected);
  }

  /**
   * Control Value Accessor Methods
   */
  writeValue(value: any): void {
    if (value) {
      this.selected = value;
      this.onChange();
    }
  }

  registerOnChange(fn: any): void {
    this.propagateChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.propagateTouch = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  validate(c: FormControl) {
    if (!this.isDisabled && this.isRequired) {
      if (!c.value) {
        return { ccrFieldGeneric: this.type };
      }
    }
    return null;
  }
}
