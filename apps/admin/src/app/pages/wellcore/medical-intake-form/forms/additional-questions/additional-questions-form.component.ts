import { Component, forwardRef, Input } from '@angular/core'
import {
  ControlValueAccessor,
  FormArray,
  FormBuilder,
  FormControl,
  NG_VALUE_ACCESSOR,
  Validators
} from '@angular/forms'
import { QuestionEntry } from '@board/pages/wellcore'
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy'

@UntilDestroy()
@Component({
  selector: 'ccr-wellcore-additional-questions-form',
  templateUrl: './additional-questions-form.component.html',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => WellcoreAdditionalQuestionsFormComponent),
      multi: true
    }
  ]
})
export class WellcoreAdditionalQuestionsFormComponent
  implements ControlValueAccessor {
  @Input() set questions(questions: QuestionEntry[]) {
    this._questions = questions ?? []
    this.createForm()
  }

  get questions(): QuestionEntry[] {
    return this._questions
  }

  public form: FormArray

  private _questions: QuestionEntry[] = []
  private propagateChange: (value) => void = () => {}
  private propagateTouched: () => void = () => {}

  constructor(private fb: FormBuilder) {}

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

  public writeValue(obj): void {
    if (!obj) {
      return
    }

    this.form.patchValue(obj)
  }

  private createForm(): void {
    this.form = this.fb.array(
      this.questions.map(
        (question) =>
          new FormControl(
            null,
            question.isRequired ? [Validators.required] : []
          )
      )
    )

    this.form.valueChanges
      .pipe(untilDestroyed(this))
      .subscribe((controls) =>
        this.propagateChange(this.form.valid ? controls : null)
      )
  }
}
