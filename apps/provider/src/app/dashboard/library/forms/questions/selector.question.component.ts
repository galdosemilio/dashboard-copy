import { Component, OnInit } from '@angular/core'
import { FormBuilder } from '@angular/forms'

import { BindFormDirective } from '@app/shared/directives/bind-form.directive'
import { BaseQuestion, QuestionDetails } from './base.question'

@Component({
  selector: 'app-library-selector-question',
  templateUrl: './selector.question.component.html',
  styleUrls: ['./selector.question.component.scss']
})
export class SelectorQuestionComponent extends BaseQuestion implements OnInit {
  constructor(
    formBuilder: FormBuilder,
    questionDetails: QuestionDetails,
    bindForm: BindFormDirective
  ) {
    super(bindForm, formBuilder, questionDetails)
  }

  ngOnInit(): void {
    super.ngOnInit()
    if (!this.answer) {
      this.form.patchValue({ value: this.question.allowedValues[0] || '' })
    }
    if (this.readonly) {
      this.form.controls.value.disable()
    }
  }
}
