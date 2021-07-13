import { Component, forwardRef, Input, OnInit } from '@angular/core'
import {
  ControlValueAccessor,
  FormBuilder,
  FormGroup,
  NG_VALUE_ACCESSOR,
  Validators
} from '@angular/forms'
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy'

export interface CcrMagnitudeEntry {
  displayName: string
  id: string
  magnitude: number
}

@UntilDestroy()
@Component({
  selector: 'ccr-magnitude-input',
  templateUrl: './magnitude-input.component.html',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CcrMagnitudeInputComponent),
      multi: true
    }
  ]
})
export class CcrMagnitudeInputComponent
  implements ControlValueAccessor, OnInit {
  @Input() label = ''
  @Input() magnitudes: CcrMagnitudeEntry[] = []

  public form: FormGroup

  private propagateChange: (obj) => void = () => {}
  private propagateTouched: () => void = () => {}

  constructor(private fb: FormBuilder) {}

  public ngOnInit(): void {
    this.createForm()
  }

  private createForm(): void {
    this.form = this.fb.group({
      magnitude: ['', Validators.required],
      value: ['', [Validators.required, Validators.min(0)]]
    })

    this.form.valueChanges.pipe(untilDestroyed(this)).subscribe((controls) => {
      const magnitude = this.magnitudes.find(
        (mag) => mag.id === controls.magnitude
      )

      if (!magnitude) {
        return
      }

      this.propagateTouched()
      this.propagateChange(
        this.form.valid ? +controls.value * +magnitude.magnitude : null
      )
    })

    if (!this.magnitudes.length) {
      return
    }

    this.form.patchValue({ magnitude: this.magnitudes[0].id })
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

  public writeValue(obj: any | null): void {
    if (!obj || !this.form) {
      return
    }

    this.form.patchValue(obj)
  }
}
