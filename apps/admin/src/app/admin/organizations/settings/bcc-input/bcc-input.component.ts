import { Component, forwardRef, Input, OnDestroy, OnInit } from '@angular/core';
import {
  ControlValueAccessor,
  FormBuilder,
  FormControl,
  FormGroup,
  NG_VALUE_ACCESSOR,
  Validators
} from '@angular/forms';
import { untilDestroyed } from 'ngx-take-until-destroy';

@Component({
  selector: 'ccr-organizations-settings-bcc-input',
  templateUrl: './bcc-input.component.html',
  styleUrls: ['./bcc-input.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => BCCInputComponent),
      multi: true
    }
  ]
})
export class BCCInputComponent implements ControlValueAccessor, OnDestroy, OnInit {
  @Input() readonly = false;

  existingEmails: string[] = [];
  form: FormGroup;

  constructor(private fb: FormBuilder) {}

  ngOnDestroy(): void {}

  ngOnInit(): void {
    this.createForm();
  }

  propagateChange(data: any): void {}

  registerOnChange(fn): void {
    this.propagateChange = fn;
  }

  registerOnTouched(): void {}

  writeValue(value: any): void {
    this.existingEmails = Array.isArray(value) ? value.slice() : [];
  }

  removeEmail(index: number): void {
    if (this.readonly) {
      return;
    }
    this.existingEmails.splice(index, 1);
    this.emitValue();
  }

  private createForm(): void {
    this.form = this.fb.group({
      email: ['', Validators.email]
    });

    this.form.valueChanges.pipe(untilDestroyed(this)).subscribe(controls => {
      if (controls.email && controls.email.indexOf(',') > -1) {
        const email = controls.email.substring(0, controls.email.length - 1);
        this.processInput(email);
      }
    });
  }

  private emitValue(): void {
    this.propagateChange(
      this.existingEmails && this.existingEmails.length ? this.existingEmails.slice() : []
    );
  }

  private processInput(email: string = this.form.value.email): void {
    const isValid = !Validators.email(new FormControl(email));
    if (isValid && this.existingEmails.indexOf(email) === -1) {
      this.existingEmails.push(email);
      this.form.reset();
      this.emitValue();
    }
  }
}
