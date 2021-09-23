import { Component, forwardRef, OnInit } from '@angular/core'
import {
  ControlValueAccessor,
  FormBuilder,
  FormGroup,
  NG_VALUE_ACCESSOR
} from '@angular/forms'
import { _ } from '@coachcare/common/shared'
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy'

@UntilDestroy()
@Component({
  selector: 'ccr-gender-input',
  templateUrl: 'gender-input.component.html',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => GenderInputComponent),
      multi: true
    }
  ]
})
export class GenderInputComponent implements ControlValueAccessor, OnInit {
  public form: FormGroup
  public genders = [
    { value: 'male', viewValue: _('SELECTOR.GENDER.MALE') },
    { value: 'female', viewValue: _('SELECTOR.GENDER.FEMALE') }
  ]

  private propagateChange: (value) => void = () => {}
  private propagateTouched: () => void = () => {}

  constructor(private fb: FormBuilder) {}

  public ngOnInit(): void {
    this.createForm()
  }

  public registerOnChange(fn): void {
    this.propagateChange = fn
  }

  public registerOnTouched(fn): void {
    this.propagateTouched = fn
  }

  public setDisabledState(isDisabled: boolean): void {
    if (!this.form) {
      return
    }

    if (isDisabled) {
      this.form.disable()
    } else {
      this.form.enable()
    }
  }

  public writeValue(gender?: 'male' | 'female'): void {
    if (!this.form || !gender) {
      return
    }

    this.form.get('gender').setValue(gender)
  }

  private createForm(): void {
    this.form = this.fb.group({ gender: [] })

    this.form.valueChanges.pipe(untilDestroyed(this)).subscribe((controls) => {
      this.propagateTouched()

      if (this.form.invalid) {
        return
      }

      this.propagateChange(controls.gender)
    })
  }
}
