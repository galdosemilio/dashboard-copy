import { Component, forwardRef, OnInit } from '@angular/core'
import {
  ControlValueAccessor,
  FormBuilder,
  FormGroup,
  NG_VALUE_ACCESSOR,
  Validators
} from '@angular/forms'
import { MatSlideToggleChange } from '@angular/material/slide-toggle'
import { MeasurementLabelEntry } from '@coachcare/sdk/dist/lib/providers/measurement/label'

@Component({
  selector: 'app-clinic-measurement-label-form',
  templateUrl: './measurement-label.form.html',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => MeasurementLabelFormComponent),
      multi: true
    }
  ]
})
export class MeasurementLabelFormComponent
  implements ControlValueAccessor, OnInit {
  public form: FormGroup
  public translationsEnabled: boolean

  private propagateChange: (value) => void = () => {}
  private propagateTouched: () => void = () => {}

  constructor(private fb: FormBuilder) {}

  public ngOnInit(): void {
    this.createForm()
  }

  public registerOnChange(fn): void {
    this.propagateChange = fn
  }

  public toggleTranslationsForm(value: MatSlideToggleChange): void {
    this.translationsEnabled = value.checked ?? false

    if (this.translationsEnabled) {
      this.form.get('translations').setValidators(Validators.required)
    } else {
      this.form.get('translations').setValidators(null)
    }
  }

  public writeValue(obj: MeasurementLabelEntry | null | undefined): void {
    if (!obj) {
      return
    }

    if (obj.translations?.length) {
      this.translationsEnabled = true
    }

    this.form.patchValue(obj)
  }

  public registerOnTouched(fn): void {
    this.propagateTouched = fn
  }

  public setDisabledState?(isDisabled: boolean): void {
    if (isDisabled) {
      this.form.disable()
    } else {
      this.form.enable()
    }
  }

  private createForm(): void {
    this.form = this.fb.group({
      name: ['', Validators.required],
      description: [''],
      translations: [null]
    })

    this.form.valueChanges.subscribe((controls) => {
      this.propagateTouched()
      this.propagateChange(this.form.valid ? controls : null)
    })
  }
}
