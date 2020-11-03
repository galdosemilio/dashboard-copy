import {
  ChangeDetectorRef,
  Component,
  forwardRef,
  Input,
  OnDestroy,
  OnInit
} from '@angular/core';
import {
  ControlValueAccessor,
  FormBuilder,
  FormGroup,
  NG_VALUE_ACCESSOR,
  Validators
} from '@angular/forms';
import { untilDestroyed } from 'ngx-take-until-destroy';

@Component({
  selector: 'sequencing-sms-form',
  templateUrl: './sms-form.component.html',
  styleUrls: ['./sms-form.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SMSFormComponent),
      multi: true
    }
  ]
})
export class SMSFormComponent implements ControlValueAccessor, OnDestroy, OnInit {
  @Input() markAsTouched;

  @Input('isDisabled') set disabled(disabled: boolean) {
    this._disabled = disabled || false;

    if (this.form && this._disabled) {
      this.form.disable({ emitEvent: false });
    } else if (this.form) {
      this.form.enable({ emitEvent: false });
    }
  }

  get disabled(): boolean {
    return this._disabled;
  }

  form: FormGroup;

  private _disabled: boolean;

  constructor(private cdr: ChangeDetectorRef, private fb: FormBuilder) {}

  ngOnDestroy(): void {}

  ngOnInit(): void {
    this.createForm();

    this.markAsTouched.pipe(untilDestroyed(this)).subscribe(() => {
      this.form.markAsTouched();
      Object.keys(this.form.controls).forEach((key) => {
        this.form.controls[key].markAsTouched();
      });
      this.cdr.detectChanges();
    });

    if (this.disabled) {
      this.form.disable({ emitEvent: false });
    }
  }

  propagateChange = (data: any) => {};

  registerOnTouched() {}

  registerOnChange(fn): void {
    this.propagateChange = fn;
  }

  writeValue(value: any): void {
    if (value) {
      this.form.patchValue({ text: value.content || value.message || value.text });
    }
  }

  private createForm(): void {
    this.form = this.fb.group({
      text: ['', Validators.required]
    });

    this.form.valueChanges
      .pipe(untilDestroyed(this))
      .subscribe((controls) => this.propagateChange(this.form.valid ? controls : null));
  }
}
