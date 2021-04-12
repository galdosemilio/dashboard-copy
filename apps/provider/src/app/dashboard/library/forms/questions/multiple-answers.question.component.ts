import { Component, OnDestroy, OnInit } from '@angular/core'
import { AbstractControl, FormArray, FormBuilder } from '@angular/forms'
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy'

import { BindFormDirective } from '@app/shared/directives/bind-form.directive'
import { BaseQuestion, QuestionDetails } from './base.question'
import { filter } from 'rxjs/operators'

@UntilDestroy()
@Component({
  selector: 'app-library-multiple-answers-question',
  templateUrl: './multiple-answers.question.component.html',
  styleUrls: ['./multiple-answers.question.component.scss']
})
export class MultipleAnswersQuestionComponent
  extends BaseQuestion
  implements OnDestroy, OnInit {
  public valueForm: FormArray

  constructor(
    formBuilder: FormBuilder,
    questionDetails: QuestionDetails,
    bindForm: BindFormDirective
  ) {
    super(bindForm, formBuilder, questionDetails)
  }

  ngOnDestroy() {}

  ngOnInit() {
    super.ngOnInit()
    this.createValueForm()

    if (this.readonly) {
      this.valueForm.controls.forEach((c: AbstractControl) => c.disable())
    }
  }

  private createValueForm() {
    this.valueForm = this.formBuilder.array(
      this.question.allowedValues.map(() => [])
    )

    this.form.valueChanges
      .pipe(untilDestroyed(this))
      .subscribe((controls) => this.setValueForm(controls))
    if (this.form.value) {
      this.setValueForm(this.form.value)
    }

    this.valueForm.valueChanges
      .pipe(
        untilDestroyed(this),
        filter((controls) => controls)
      )
      .subscribe((controls) => {
        const values = controls
          .map((control, index) => [control, index])
          .filter(([control]) => control)
          .map(([, index]) => this.question.allowedValues[index])
        this.form.patchValue({ value: values }, { emitEvent: false })
      })
  }

  private setValueForm(formValue: any) {
    const setValues: string[] = formValue.value || []
    const setIndexes: number[] = setValues.map((value: string) =>
      this.question.allowedValues.findIndex(
        (allowedValue: string) => value === allowedValue
      )
    )
    const newValue: boolean[] = []

    setIndexes.forEach((index: number) => (newValue[index] = true))
    this.valueForm.patchValue(newValue)
  }
}
