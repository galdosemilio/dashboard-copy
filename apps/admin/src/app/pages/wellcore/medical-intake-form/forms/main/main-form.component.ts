import { Component, forwardRef, OnInit } from '@angular/core'
import {
  ControlValueAccessor,
  FormBuilder,
  FormGroup,
  NG_VALUE_ACCESSOR
} from '@angular/forms'

@Component({
  selector: 'ccr-wellcore-main-form',
  templateUrl: './main-form.component.html',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => WellcoreMainFormComponent),
      multi: true
    }
  ]
})
export class WellcoreMainFormComponent implements ControlValueAccessor, OnInit {
  public form: FormGroup

  private propagateChange: (value) => void = () => {}
  private propagateTouched: () => void = () => {}

  constructor(private fb: FormBuilder) {}

  public ngOnInit(): void {
    this.form = this.fb.group({
      address1: [],
      address2: [],
      city: [],
      dob: [],
      email: [],
      firstName: [],
      gender: [],
      lastName: [],
      state: [],
      phone: [],
      zip: []
    })
  }

  public writeValue(obj): void {
    if (!obj) {
      return
    }

    this.form.patchValue(obj)
  }
  public registerOnChange(fn): void {
    this.propagateChange = fn
  }

  public registerOnTouched(fn): void {
    this.propagateTouched = fn
  }

  public setDisabledState(isDisabled: boolean): void {
    if (isDisabled) {
      this.form.disable()
    } else {
      this.form.enable()
    }
  }
}
