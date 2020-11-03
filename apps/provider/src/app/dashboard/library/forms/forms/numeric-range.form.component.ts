import { Component, forwardRef, Input, OnDestroy } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BindForm, BINDFORM_TOKEN } from '@app/shared';
import { untilDestroyed } from 'ngx-take-until-destroy';

@Component({
  selector: 'app-library-numeric-range-form',
  templateUrl: './numeric-range.form.component.html',
  providers: [
    {
      provide: BINDFORM_TOKEN,
      useExisting: forwardRef(() => NumericRangeFormComponent)
    }
  ]
})
export class NumericRangeFormComponent implements BindForm, OnDestroy {
  @Input()
  set content(allowedValues: string[]) {
    if (allowedValues && allowedValues.length) {
      this._content = allowedValues;
      this.rangeForm.patchValue({
        min: allowedValues[0],
        max: allowedValues[allowedValues.length - 1]
      });
    }
  }

  get content(): string[] {
    return this._content;
  }

  @Input()
  readonly: boolean = false;

  public form: FormGroup;
  public rangeForm: FormGroup;

  private _content: string[];

  constructor(private formBuilder: FormBuilder) {
    this.createForms();
  }

  ngOnDestroy(): void {}

  createForms(): void {
    this.form = this.formBuilder.group({
      value: [[], Validators.required]
    });

    this.rangeForm = this.formBuilder.group(
      {
        min: [0, Validators.required],
        max: [0, Validators.required]
      },
      {
        validator: (rangeForm: AbstractControl) => {
          const { min, max } = rangeForm.value;
          if (Number(min) > Number(max)) {
            return { invalidRange: true };
          } else {
            return null;
          }
        }
      }
    );

    this.rangeForm.valueChanges.pipe(untilDestroyed(this)).subscribe((value) => {
      if (this.rangeForm.valid) {
        this.refreshForm(this.getIndexedArray(value.min, value.max));
      }
    });

    this.rangeForm.patchValue({ min: 0, max: 5 });
  }

  private getIndexedArray(min: number, max: number): any[] {
    const array = [];

    for (let i = min; i <= max; ++i) {
      array.push(`${i}`);
    }

    return array;
  }

  private refreshForm(array: string[]): void {
    this.form.patchValue({ value: array });
  }
}
