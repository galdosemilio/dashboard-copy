import { Component, forwardRef, Input, OnDestroy, OnInit } from '@angular/core'
import {
  ControlValueAccessor,
  FormBuilder,
  FormGroup,
  NG_VALUE_ACCESSOR
} from '@angular/forms'
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy'

@UntilDestroy()
@Component({
  selector: 'ccr-feature-toggle-input',
  templateUrl: './feature-toggle-input.component.html',
  styleUrls: ['./feature-toggle-input.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => FeatureToggleInputComponent),
      multi: true
    }
  ]
})
export class FeatureToggleInputComponent
  implements ControlValueAccessor, OnDestroy, OnInit {
  @Input() inheritable: boolean
  @Input() label: string
  @Input() popupDescription?: { title: string; description: string }
  @Input() subLabel?: string
  @Input() zendeskLink?: string
  @Input()
  set readonly(readonly: boolean) {
    this._readonly = readonly
    setTimeout(() => {
      if (readonly) {
        this.form.disable()
      } else {
        this.form.enable()
      }
    })
  }

  get readonly(): boolean {
    return this._readonly
  }

  form: FormGroup
  private _readonly: boolean

  constructor(private fb: FormBuilder) {}

  ngOnDestroy(): void {}

  ngOnInit(): void {
    this.createForm()
    if (this.readonly) {
      this.form.disable({ emitEvent: false })
    } else {
      this.form.enable({ emitEvent: false })
    }
  }

  propagateChange(data: any): void {}

  registerOnChange(fn): void {
    this.propagateChange = fn
  }

  registerOnTouched(): void {}

  writeValue(value: any): void {
    this.form.patchValue({
      active: value === null ? 'inherit' : value || false
    })
  }

  private createForm(): void {
    this.form = this.fb.group({
      active: [false]
    })

    this.form.valueChanges
      .pipe(untilDestroyed(this))
      .subscribe((controls) =>
        this.propagateChange(
          controls.active === 'inherit' ? null : controls.active
        )
      )
  }
}
