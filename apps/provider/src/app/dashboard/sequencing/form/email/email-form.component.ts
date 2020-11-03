import { CdkTextareaAutosize } from '@angular/cdk/text-field';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  forwardRef,
  Input,
  OnDestroy,
  OnInit,
  ViewChild
} from '@angular/core';
import {
  ControlValueAccessor,
  FormBuilder,
  FormGroup,
  NG_VALUE_ACCESSOR,
  Validators
} from '@angular/forms';
import { untilDestroyed } from 'ngx-take-until-destroy';
import { Subject } from 'rxjs';

@Component({
  selector: 'sequencing-email-form',
  templateUrl: './email-form.component.html',
  styleUrls: ['./email-form.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => EmailFormComponent),
      multi: true
    }
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EmailFormComponent implements ControlValueAccessor, OnDestroy, OnInit {
  @ViewChild(CdkTextareaAutosize, { static: true }) textarea: CdkTextareaAutosize;
  @Input() markAsTouched: Subject<void>;

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

  registerOnTouched(): void {}

  registerOnChange(fn): void {
    this.propagateChange = fn;
  }

  writeValue(value: any): void {
    if (value) {
      this.form.patchValue({
        subject: value.subject,
        header: value.header || value.title,
        text: value.content || value.message || value.text
      });

      setTimeout(() => {
        this.textarea.resizeToFitContent(true);
      }, 400);
    }
  }

  private createForm(): void {
    this.form = this.fb.group({
      subject: ['', Validators.required],
      header: ['', Validators.required],
      text: ['', [Validators.required, Validators.maxLength(5000)]]
    });

    this.form.valueChanges
      .pipe(untilDestroyed(this))
      .subscribe((controls) => this.propagateChange(this.form.valid ? controls : null));
  }
}
