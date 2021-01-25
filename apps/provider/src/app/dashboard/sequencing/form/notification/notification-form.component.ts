import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  forwardRef,
  Input,
  OnDestroy,
  OnInit
} from '@angular/core'
import {
  ControlValueAccessor,
  FormBuilder,
  FormGroup,
  NG_VALUE_ACCESSOR,
  Validators
} from '@angular/forms'
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy'
import { Subject } from 'rxjs'

@UntilDestroy()
@Component({
  selector: 'sequencing-notification-form',
  templateUrl: './notification-form.component.html',
  styleUrls: ['./notification-form.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => NotificationFormComponent),
      multi: true
    }
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NotificationFormComponent
  implements ControlValueAccessor, OnDestroy, OnInit {
  @Input() markAsTouched: Subject<void>

  @Input('isDisabled') set disabled(disabled: boolean) {
    this._disabled = disabled || false

    if (this.form && this._disabled) {
      this.form.disable({ emitEvent: false })
    } else if (this.form) {
      this.form.enable({ emitEvent: false })
    }
  }

  get disabled(): boolean {
    return this._disabled
  }

  public currentCharLength = 0
  public form: FormGroup
  public MAX_CHAR_LENGTH = 240
  public textLengthOverflow = false

  private _disabled: boolean

  constructor(private cdr: ChangeDetectorRef, private fb: FormBuilder) {}

  ngOnDestroy(): void {}

  ngOnInit(): void {
    this.createForm()
    this.markAsTouched.pipe(untilDestroyed(this)).subscribe(() => {
      this.form.markAsTouched()
      Object.keys(this.form.controls).forEach((key) => {
        this.form.controls[key].markAsTouched()
      })
      this.cdr.detectChanges()
    })

    if (this.disabled) {
      this.form.disable({ emitEvent: false })
    }
  }

  propagateChange = (data: any) => {}

  registerOnChange(fn): void {
    this.propagateChange = fn
  }

  registerOnTouched(): void {}

  writeValue(value: any): void {
    if (value) {
      this.form.patchValue({
        header: value.header,
        text: value.content || value.message || value.text
      })
    }
  }

  private createForm(): void {
    this.form = this.fb.group({
      header: ['', Validators.required],
      text: ['', Validators.required]
    })

    this.form.valueChanges.pipe(untilDestroyed(this)).subscribe((controls) => {
      this.propagateChange(this.form.valid ? controls : null)
      this.currentCharLength = controls.text ? controls.text.length : 0
      this.textLengthOverflow = this.currentCharLength > this.MAX_CHAR_LENGTH
    })
  }
}
