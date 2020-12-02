import { Component, OnDestroy, OnInit } from '@angular/core'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { BindFormDirective } from '@app/shared/directives/bind-form.directive'
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy'
import { BaseQuestion, QuestionDetails } from './base.question'

@UntilDestroy()
@Component({
  selector: 'app-library-linear-scale-question',
  templateUrl: './linear-scale.question.component.html',
  styleUrls: ['./linear-scale.question.component.scss']
})
export class LinearScaleQuestionComponent
  extends BaseQuestion
  implements OnDestroy, OnInit {
  public sliderOpts = {
    displayWith: (value: number) => this.displayWithCalc(value),
    max: 1000,
    min: 0,
    showThumbLabel: true,
    step: 1000
  }
  public valueForm: FormGroup

  private fixedValue: number

  constructor(
    bindForm: BindFormDirective,
    formBuilder: FormBuilder,
    questionDetails: QuestionDetails
  ) {
    super(bindForm, formBuilder, questionDetails)
  }

  ngOnDestroy(): void {}

  ngOnInit(): void {
    super.ngOnInit()
    this.createValueForm()
    this.sliderOpts.step = Math.ceil(
      this.sliderOpts.max / (this.question.allowedValues.length - 1)
    )
    if (this.answer) {
      const value: number =
        this.question.allowedValues.indexOf(
          this.answer.response.value.toString()
        ) * this.sliderOpts.step
      if (this.readonly) {
        this.fixedValue = value
      }
      this.valueForm.patchValue({
        value: value
      })
    }
  }

  private createValueForm(): void {
    this.valueForm = this.formBuilder.group({
      value: [undefined, Validators.required]
    })

    this.valueForm.valueChanges
      .pipe(untilDestroyed(this))
      .subscribe((controls) => {
        if (this.readonly && controls.value !== this.fixedValue) {
          this.valueForm.patchValue({ value: this.fixedValue })
        } else {
          this.form.patchValue({ value: this.displayWithCalc(controls.value) })
        }
      })

    this.valueForm.patchValue({ value: 0 })
  }

  private displayWithCalc(value: number): string {
    return this.question.allowedValues[Math.ceil(value / this.sliderOpts.step)]
  }
}
