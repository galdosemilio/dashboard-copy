import { Component, OnDestroy, OnInit } from '@angular/core'
import { AbstractControl, FormArray, FormBuilder } from '@angular/forms'
import { untilDestroyed } from 'ngx-take-until-destroy'

import { BindFormDirective } from '@app/shared/directives/bind-form.directive'
import { BaseQuestion, QuestionDetails } from './base.question'

@Component({
  selector: 'app-library-multiple-answers-question',
  templateUrl: './multiple-answers.question.component.html',
  styleUrls: ['./multiple-answers.question.component.scss']
})
export class MultipleAnswersQuestionComponent extends BaseQuestion
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

    if (this.readonly) {
      this.form.valueChanges
        .pipe(untilDestroyed(this))
        .subscribe((controls) => this.setValueForm(controls))
      if (this.form.value) {
        this.setValueForm(this.form.value)
      }
    } else {
      this.valueForm.valueChanges
        .pipe(untilDestroyed(this))
        .subscribe((controls) => {
          if (controls) {
            const values: string[] = []
            controls.forEach((control: boolean, index: number) => {
              if (control) {
                values.push(this.question.allowedValues[index])
              }
            })
            this.form.patchValue({ value: values })
          }
        })
    }
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
