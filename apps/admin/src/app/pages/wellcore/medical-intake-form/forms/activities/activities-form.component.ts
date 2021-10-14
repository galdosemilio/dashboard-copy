import { Component, forwardRef, Input, OnInit } from '@angular/core'
import {
  ControlValueAccessor,
  FormBuilder,
  FormControl,
  FormGroup,
  NG_VALUE_ACCESSOR,
  Validators
} from '@angular/forms'
import { QuestionEntry } from '@board/pages/wellcore'
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy'

@UntilDestroy()
@Component({
  selector: 'ccr-wellcore-activities-form',
  templateUrl: './activities-form.component.html',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => WellcoreActivitiesFormComponent),
      multi: true
    }
  ]
})
export class WellcoreActivitiesFormComponent
  implements ControlValueAccessor, OnInit {
  @Input() set questions(questions: QuestionEntry[]) {
    this._questions = questions ?? []
    this.resolveQuestions()
    this.createForm()
  }

  get questions(): QuestionEntry[] {
    return this._questions
  }

  public form: FormGroup
  public radioQuestions: QuestionEntry[] = []
  public checkboxQuestions: QuestionEntry[] = []

  private _questions: QuestionEntry[] = []
  private propagateChange: (value) => void = () => {}
  private propagateTouched: () => void = () => {}

  constructor(private fb: FormBuilder) {}

  public ngOnInit(): void {
    this.resolveQuestions()
    this.createForm()
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

  public writeValue(obj): void {
    if (!obj) {
      return
    }

    this.form.patchValue(obj)
  }

  private createForm(): void {
    this.form = this.fb.group({
      radioQuestions: this.fb.array(
        this.radioQuestions.map(
          (question) =>
            new FormControl(
              null,
              question.isRequired ? [Validators.required] : []
            )
        )
      ),
      checkboxQuestions: this.fb.array(
        this.checkboxQuestions.map((question) =>
          this.fb.array(question.options.map(() => new FormControl()))
        )
      )
    })

    this.form.valueChanges.pipe(untilDestroyed(this)).subscribe((controls) => {
      this.propagateTouched()
      this.propagateChange(this.form.valid ? controls : null)
    })
  }

  private resolveQuestions(): void {
    this.radioQuestions = this.questions.filter(
      (question) => question.type === '5' || question.type === '3'
    )
    this.checkboxQuestions = this.questions.filter(
      (question) => question.type === '4'
    )
  }
}
